import chalk from 'chalk'
import moment from 'moment'

export default new class Logger {
    _now() {
        return moment().format('<Y-MM-DD> (HH:mm:ss)')
    }

    info(message) {
        console.log(chalk`{reset ${this._now()}} | {black [{white Info}]}`, message)
    }

    error(message) {
        console.error(chalk`{reset ${this._now()}} | {bgRedBright.black [Error]}`, message)
    }
}