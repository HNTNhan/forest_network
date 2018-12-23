import axios from "axios";
import {decode} from "../transaction";

export async function getData(web, pk) {
    let data = [];
    let pages = 0;
    let per_page = 30;
    await axios.get(web + "/tx_search?query=%22account=%27" + pk + "%27%22")
        .then(res => {
            pages = Math.floor(res.data.result.total_count / 30);
            if (res.data.result.total_count % 30 > 0) pages = pages + 1;
        });
    for (let k = 1 ; k <= pages; k++) {
        await axios.get(web + "/tx_search?query=%22account=%27" + pk + "%27%22&page=" + k)
            .then(res => {
                data = data.concat(res.data.result.txs);
            });
    }
    return data;
}

export async function getName(web, pk) {
    let name = "No Name";
    let pages = 0;
    let per_page = 30;
    await axios.get(web + "/tx_search?query=%22account=%27" + pk + "%27%22")
        .then(res => {
            pages = Math.floor(res.data.result.total_count / 30);
            if (res.data.result.total_count % 30 > 0) pages = pages + 1;
        });
    for (let k = pages; k >= 1; k--) {
        await axios.get(web + "/tx_search?query=%22account=%27" + pk + "%27%22&page=" + k)
            .then(res => {
                for(let i=res.data.result.txs.length-1; i>=0; i--) {
                    let tx = Buffer.from(res.data.result.txs[i].tx, "base64");
                    try {
                        tx = decode(tx);
                    }
                    catch(error) {
                        continue;
                    }
                    if(tx.operation === "update_account" && tx.params.key === "name") {
                        name = tx.params.value;
                        break;
                    }
                }
            });
        if(name !== "No Name") break;
    }
    return name;
}

export async function convertName(pk, list_pk,  list_name, user_name) {
    for(let i=0; i<list_pk.addresses.length; i++) {
        if(pk === list_pk.addresses[i]) {
            return list_name[i];
        }
    }
    return user_name
}

export async function getTime(web, height) {
    let time = "No Name";
    await axios.get(web + "/commit?height=" + height)
        .then(res => {
            time = res.data.result.signed_header.header.time;
        });
    time = new Date(time);
    time = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(time);
    return time;
}

export async function Energy(cel, height) {
    const hesodutru = 1;
    const kichthuongtoida = 22020096;
    const chukybiendoi = 86400;
    const soceltoida = 9007199254740991;
    let nangluongsudungtrongchukybiendoi;
    const nangluonghethong = hesodutru * kichthuongtoida * chukybiendoi;
    nangluongsudungtrongchukybiendoi = 0;
    const nangluongtaikhoan = cel * nangluonghethong / soceltoida - nangluongsudungtrongchukybiendoi;
}