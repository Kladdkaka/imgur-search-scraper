import chalk from 'chalk'

export default new class Logger {
    info(message) {
        console.log(chalk`{reset ${this._now()}} | {black [{white Info}]}`, message)
    }

    error(message) {
        console.error(chalk`{reset ${this._now()}} | {bgRedBright.black [Error]}`, message)
    }
}
