import {ControllerClass, getInstance} from "xpresser";
import {Http} from "xpresser/types/http";

import qrcodeWithLogo from "../utils/qrcodeWithLogo";

const $ = getInstance()

/**
 * AppController
 */
class AppController extends ControllerClass {

    /**
     * Example controller action.
     * @param {Http} http
     */
    async index(http: Http): Promise<Http.Response> {
        const data = "https://paulandchristies.com"
        await qrcodeWithLogo(data, `${$.path.storage("logo.png")}`, { width: 450 }, "PNG", `${$.path.storage(`${$.helpers.randomInteger(111,999)}_qr.png`)}`)
        // await QRLogo.generateQRWithLogo()
        return http.send({
            msg: 'Techie Oriname'
        })
    }

}

export = AppController;
