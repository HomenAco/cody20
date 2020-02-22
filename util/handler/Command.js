module.exports = class Command {
    constructor(client, options = []){
        this.client = client
        this.command = options.command
        this.aliases = !options.aliases ? false : options.aliases
        this.description = options.description
        this.label = options.label || []
        this.hasPermission = !options.hasPermission ? false : options.hasPermission
        this.mePermission = !options.mePermission ? false : options.mePermission
        this.isOwner = !options.isOwner ? false : options.isOwner
    }
    async run(client, message, args){
        throw new Error('informe o método run()')
    }
}