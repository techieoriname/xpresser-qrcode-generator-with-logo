import qrcode from "qrcode"
import sharp from "sharp"
import fs from "fs"
import {getInstance} from "xpresser";

const $ = getInstance()

const ERRORS = {
    "INSUFF_PARAMS": {
        name: "InsufficientParameters Error",
        message: " is required when outputting QR code "
    },
    "ERR_CK": {
        name: "ErrorChecking Error",
        message: "Error occurred while error-checking parameters"
    },
    "INVALID_IMGFILE": {
        name: "InvalidImageFilePath Error",
        message: " is an invalid image file path for the parameter "
    }
};


async function generateQRWithLogo(embedded_data: string, logo_image_path: string, qr_options: object, output_type: string, saveas_file_name: string, callback?: any) {
    let qr_image_path = $.path.storage(`${$.helpers.randomInteger(111,999)}_init_non_logo_qr.png`)
    console.log('This is saveas_file_name: ' + saveas_file_name);

    let is_saveas_file_name_a_string = true;
    console.log("saveas_file_name instanceof String: " + is_saveas_file_name_a_string);

    if (embedded_data && logo_image_path && output_type) {

        if(output_type == "PNG") {

            if (!saveas_file_name) {
                throw SyntaxError(JSON.stringify( {name: ERRORS["INSUFF_PARAMS"].name, message: "saveas_file_name" + ERRORS["INSUFF_PARAMS"].message + "to PNG"}));
            } console.log("All PNG parameters");

        }
    }





    if (!output_type) {
        throw SyntaxError(JSON.stringify( {name: ERRORS["INSUFF_PARAMS"].name, message: "output_type" + ERRORS["INSUFF_PARAMS"].message}));

    } else if (!embedded_data && logo_image_path && output_type) {
        throw SyntaxError(JSON.stringify( {name: ERRORS["INSUFF_PARAMS"].name, message: "embedded_data" + ERRORS["INSUFF_PARAMS"].message + "to " + output_type}));
    } else if (!logo_image_path && embedded_data && output_type) {
        throw SyntaxError(JSON.stringify( {name: ERRORS["INSUFF_PARAMS"].name, message: "logo_image_path" + ERRORS["INSUFF_PARAMS"].message + "to " + output_type}));
    }


    if ((logo_image_path.lastIndexOf('.')) == -1) {
        throw SyntaxError(JSON.stringify( {name: ERRORS["INVALID_IMGFILE"].name, message: logo_image_path + ERRORS["INVALID_IMGFILE"].message + "logo_image_path"}));
    }

    if ((saveas_file_name.lastIndexOf('.')) == -1) {
        throw SyntaxError(JSON.stringify( {name: ERRORS["INVALID_IMGFILE"].name, message: saveas_file_name + ERRORS["INVALID_IMGFILE"].message + "saveas_file_name  Ensure that .png was included"}));
    }



    // @ts-ignore
    if (qr_options.length == 0) {
        qr_options = {errorCorrectionLevel: 'H'}
    }



    await generateQR(embedded_data, qr_options, async function (b64: any) {

        await saveAsPNG(b64, qr_image_path, async function () {

            if (output_type == "PNG") {

                await addLogoToQRImage(qr_image_path, logo_image_path, "PNG", saveas_file_name, async function () {

                    callback()
                });

            } else if (output_type == "Base64") {

                await addLogoToQRImage(qr_image_path, logo_image_path, "Base64", saveas_file_name, async function (qrlogo_b64: any) {

                    //let qrlogo_base64 = qrlogo_b64;

                    console.log("Base 64 Data: " + qrlogo_b64);

                    await fs.unlink(qr_image_path, async function () {

                        callback(qrlogo_b64);

                    });
                })
            }

        })

    });

}


async function generateQR(embedded_data: HTMLCanvasElement | any, options: object | any, callback: any) {

    if (typeof options === "object") {

        try {
            qrcode.toDataURL(embedded_data, options, function (err, b64) {
                if (b64) {
                    callback(b64);
                } else if (err) {
                    console.log(err);
                }
            });
        } catch (err) { console.error(err) }

    } else {

        try {
            await qrcode.toDataURL(embedded_data, { errorCorrectionLevel: 'H'}, function (err, b64) {
                if (b64) { callback(b64); }
                else if (err) { console.log(err); }
            });
        } catch (err) { console.error(err) }

    }

};



/** @param b64
 @param filename
 @param callback  file name that it was saved as is passed to the callback function */
async function saveAsPNG(b64:string, filename: string, callback: any) {
    console.log('Saving QR as: ' + filename);
    let base64Data = await b64.replace(/^data:image\/png;base64,/, "");
    fs.writeFile(filename, base64Data, 'base64', function() {
        if (callback) {
            callback(filename);
        }
    });
}



async function addLogoToQRImage(qr_image_path: string, logo_image_path: string, output_type: string, saveas_file_name: string, callback: any) {

    if (output_type == "Base64") {
        if (!callback) { console.log('Error: No callback provided'); }

        else {
            console.log('Output: Base64');
            sharp(qr_image_path)
                .composite([{input: logo_image_path, gravity: 'centre'}])
                .toBuffer((err, data, info) => {

                    if (err) {
                        console.log("Error Converting Image Buffer to Base 64: \n" + err);
                    }

                    if (data) {
                        // let base64data = Buffer.from(data, 'binary').toString('base64');
                        let base64data = Buffer.from(data).toString('base64');
                        callback(base64data); //console.log(base64data);
                    }
                });
        }

    } else if (output_type == "PNG") {

        console.log('Output: PNG');
        console.log('SaveAs: ' + saveas_file_name);

        if (saveas_file_name) {

            try {
                await sharp(qr_image_path)
                    .composite([{input: logo_image_path, gravity: 'centre'}])
                    .toFile(saveas_file_name);

            } catch(err) {
                console.log("Error encountered when attempting to save QR with logo, check 'saveas_file_name' parameter");
                console.log(err);
            }

        } else {
            console.log("Error: Unable to save QR with logo because 'saveas_file_name' is not defined");
            // throw error *****
        }

    }
}


// exports.generateQRWithLogo = generateQRWithLogo;
export default generateQRWithLogo
