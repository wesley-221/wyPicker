import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/authentication/user';

@Pipe({
	name: 'search'
})

export class SearchPipe implements PipeTransform {
	transform(allUsers: User[], username: string): any {
		if (username == '' || username == undefined) {
			return allUsers;
		}

		let returnUsers = [];

		returnUsers = allUsers.filter(user => {
			return user.username.toLowerCase().includes(username.toLowerCase());
		});

		return returnUsers;
	}
}
