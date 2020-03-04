const Command = require('../util/handler/Command')
module.exports = class Staff extends Command {
    constructor(client) {
        super(client, {
            command: 'staffrole',
            aliases: ['staffroles', 'staffersrole', 'staffersroles', 'stfrole', 'stfroles']
        })
        this._allowedRoles = ['owner', 'subowner', 'operator'];
        this._actions = [{
            name: 'add',
            aliases: ['set', 'promote']
        }, {
            name: 'remove',
            aliases: ['del', 'delete']
        }]
    }
    async run({message, argsAlt, prefix, command, userDB, t}) {
        if(!this.client.staff.hasSomeRoles(userDB.roles, this._allowedRoles)) return message.channel.send(t('commands:staffrole.dontHaveRole', { 
            member: message.member,
            roles: this._allowedRoles.map(role => `\`${role}\``).join(', ')
        }));
        const action = argsAlt[0] ?
            this._actions.find(action => action.name === argsAlt[0].toLowerCase()
            || action.aliases.includes(argsAlt[0].toLowerCase())).name
            || false
            : false;
        if(!action) return message.channel.send(t('commands:staffrole.noAction', {
            member: message.member,
            actions: this._actions.map(action => `\`${action.name}\``).join(' **|** ')
        }));
        const user = argsAlt[1] ?
            message.mentions.users.first()
            || await this.client.users.fetch(argsAlt[1]).catch(() => {return false})
            || false
            : false;
        if(!user || (argsAlt[1].replace(/[^0-9]/g, '') !== user.id)) return message.channel.send(t('commands:staffrole.invalidFormat', {
            member: message.member,
            format: `${prefix}${command} <${this._actions.map(action => action.name).join('/')}> <@user/user-id> <role-name>`
        }));
        const role = argsAlt[2] ? this.client.staff.roles.find(role => role === argsAlt[2].toLowerCase()) || false : false;
        if(!role) return message.channel.send(t('commands:staffrole.noRole', {
            member: message.member,
            roles: this.client.staff.roles.map(role => `\`${role}\``).join(' **|** ')
        }));
        if(!this.client.staff.isHigher(this.client.staff.highestRole(userDB.roles), role)) return message.channel.send(t('commands:staffrole.roleHigher', {
            member: message.member
        }));
        const targetDB = await this.client.database.findOrCreate('Users', {_id: user.id});
        switch(action) {
            case 'add': {
                if(targetDB.roles.includes(role)) return message.channel.send(t('commands:staffrole.hasRole', {
                    member: message.member,
                    role
                }));
                this.client.staff.addRole(user.id, role);
                message.channel.send(t('commands:staffrole.added', {
                    member: message.member,
                    role,
                    target: user.tag
                }));
            } break;
            case 'remove': {
                if(!targetDB.roles.includes(role)) return message.channel.send(t('commands:staffrole.noHasRole', {
                    member: message.member,
                    role
                }));
                this.client.staff.removeRole(user.id, role);
                message.channel.send(t('commands:staffrole.removed', {
                    member: message.member,
                    role,
                    target: user.tag
                }));
            } break;
        }
    }
}