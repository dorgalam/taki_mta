import React from 'react';

export default class UsersList extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.userList = this.userList.bind();
    }
    render() {
        return (
            <fieldset>
                <legend>online users</legend>
                <ul>{this.userList(this.props.users).map(
                    user => (
                        <li>{user}</li>
                    )
                )} </ul>
            </fieldset>

        );
    }

    userList(users) {
        let res = [];
        for (let user in users) {
            res.push(users[user]);
        }
        return res;
    }
}


