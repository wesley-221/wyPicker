import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { OsuOauthToken } from '../models/authentication/osu-oauth-token';
import { BehaviorSubject, Observable } from 'rxjs';
import { StoreService } from './store.service';
import { EndpointOsu } from '../models/osu-api/endpoint-osu';
import { EndpointMe } from '../models/osu-api/endpoint-me';

@Injectable({
	providedIn: 'root'
})

export class OsuService {
	private readonly STORE_OAUTH: string = "osu_oauth";
	private readonly STORE_AUTHENTICATED_USER: string = "osu_authenticated_user";
	private oauthResponse$: BehaviorSubject<OsuOauthToken>;

	public oauthToken: String;
	public oauthTokenExpiresAt: Date;

	public authenticatedUser: EndpointMe;

	public readonly ME_ENDPOINT: EndpointOsu = new EndpointOsu('me', null, EndpointMe);

	constructor(private electronService: ElectronService, private httpClient: HttpClient, private storeService: StoreService) {
		this.oauthResponse$ = new BehaviorSubject(null);

		// Validate the oauth token
		const oauthToken = this.storeService.get(this.STORE_OAUTH);

		// Check if there is a token saved
		if (oauthToken != undefined) {
			this.oauthToken = oauthToken.access_token;
			this.oauthTokenExpiresAt = oauthToken.expires;

			const currentDate = new Date(),
				tokenExpireDate = new Date(this.oauthTokenExpiresAt);

			// The token has expired
			// TODO: auto refresh token when its expired, opt-in?
			if (currentDate > tokenExpireDate) {
				this.logout();
			}
			else {
				const authenticatedUser = this.storeService.get(this.STORE_AUTHENTICATED_USER);

				if (authenticatedUser != undefined) {
					this.authenticatedUser = EndpointMe.serializeJson(authenticatedUser);
				}
			}
		}
	}

	/**
	 * Get the authorization url of the mappicker app
	 * @returns authorization url of the mappicker app
	 */
	private getOsuOauthUrl(): string {
		let parameters = [
			{ parameterName: "client_id", value: environment.osu.client_id },
			{ parameterName: "redirect_uri", value: environment.osu.redirect_uri },
			{ parameterName: "response_type", value: "code" },
			{ parameterName: "scope", value: "identify%20public" }
		];

		let finalLink = "https://osu.ppy.sh/oauth/authorize?"

		if (parameters != null) {
			for (let parameter in parameters) {
				finalLink += `${parameters[parameter].parameterName}=${parameters[parameter].value}&`
			}

			finalLink = finalLink.substring(0, finalLink.length - 1);
		}

		return finalLink;
	}

	/**
	 * Open a window for the osu oauth process
	 */
	private openOsuBrowserWindow(): void {
		const BrowserWindow = this.electronService.remote.BrowserWindow;
		let win = new BrowserWindow();

		win.loadURL(this.getOsuOauthUrl());

		let contents = win.webContents
		contents.on('will-redirect', (_, url) => {
			const oauthToken = url.replace(`${environment.osu.redirect_uri}?code=`, '');

			this.httpClient.post<any>(`${environment.apiUrl}request-osu-token`, oauthToken).subscribe(response => {
				const oauthToken: OsuOauthToken = response.body;
				this.oauthResponse$.next(oauthToken);
			}, (err) => {
				console.log(err);
			})

			win.close();
		});
	}

	/**
	 * Logout the currently authenticated user
	 */
	public logout() {
		this.storeService.delete(this.STORE_AUTHENTICATED_USER);
		this.storeService.delete(this.STORE_OAUTH);

		this.authenticatedUser = null;
	}

	/**
	 * Get the oauth token for osu
	 * @returns observable that contains the oauth token
	 */
	public startOsuOauthProcess(): Observable<OsuOauthToken> {
		this.openOsuBrowserWindow();

		return this.oauthResponse$;
	}

	/**
	 * Cache the oauth token data
	 * @param osuOauthToken
	 */
	public cacheOsuOauthToken(osuOauthToken: OsuOauthToken): void {
		let expireDate = new Date();
		expireDate = new Date(expireDate.getTime() + (osuOauthToken.expires_in * 1000));

		this.oauthToken = osuOauthToken.access_token;
		this.oauthTokenExpiresAt = expireDate;

		this.storeService.set(this.STORE_OAUTH, {
			'access_token': osuOauthToken.access_token,
			'expires': expireDate.getTime()
		});
	}

	/**
	 * Cache the current user as the authenticated user
	 * @param me
	 */
	public cacheAuthenticatedUser(me: EndpointMe): void {
		this.storeService.set(this.STORE_AUTHENTICATED_USER, EndpointMe.convertToJson(me));
	}

	/**
	 * Get the public osu data of the current logged in user
	 */
	public getMeData(): Observable<EndpointMe> {
		return this.httpClient.get<EndpointMe>(this.ME_ENDPOINT.endpointUrl);
	}
}