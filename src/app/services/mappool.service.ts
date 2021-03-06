import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { SuggestedMap } from '../models/mappool/suggested-map';
import { Tournament } from '../models/tournament';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class MappoolService {
	private readonly apiUrl: string = environment.apiUrl;

	constructor(private httpClient: HttpClient) { }

	/**
	 * Suggest a map
	 * @param suggestedMap the map to suggest
	 */
	public suggestAMap(suggestedMap: SuggestedMap): Observable<SuggestedMap> {
		return this.httpClient.post<SuggestedMap>(`${this.apiUrl}wypicker/suggest-a-map`, suggestedMap);
	}

	/**
	 * Check if a map has been suggested already
	 * @param suggestedMap the map to check
	 */
	public isMapSuggested(suggestedMap: SuggestedMap): Observable<SuggestedMap> {
		return this.httpClient.post<SuggestedMap>(`${this.apiUrl}wypicker/is-suggested`, suggestedMap);
	}

	/**
	 * Get all suggested maps from the given tournament
	 * @param tournamentId
	 */
	public getAllSuggestedMapsFromTournament(tournament: Tournament): Observable<SuggestedMap[]> {
		return this.httpClient.get<SuggestedMap[]>(`${this.apiUrl}wypicker/get-all-suggested-maps-from-tournament/${tournament.id}`);
	}

	/**
	 * Delete a suggested map
	 * @param suggestedMap
	 */
	public deleteSuggestedMap(suggestedMap: SuggestedMap): Observable<SuggestedMap> {
		return this.httpClient.post<SuggestedMap>(`${this.apiUrl}wypicker/delete-suggested-map`, suggestedMap);
	}
}
