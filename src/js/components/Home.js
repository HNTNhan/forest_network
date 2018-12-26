import React, {Component} from 'react';
import axios from 'axios';
import {sign, encode, decode,hash} from '../transaction/index';
import { Keypair } from 'stellar-base';
import {compose} from "redux";
import {getTime, getEnergy, getData, convertName, getLatestBlockTime} from "./Funtions";
import moment from "moment"
import FileBase64 from 'react-file-base64';

const vstruct = require('varstruct');
const base32 = require('base32.js');

const public_key = "GCT5H6TEK7Q43EYJI6NWZ4DPGZXQUNFLW6VWD5EM4VSLUDNUA3AJNIKP";
const pk1 = "GCZRPJNYGLR4VD3HROBGDUF4IIS32DAF5FNBRFRHUD4QCDE5ZKTEB37B";
const imageBase64 = "base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkIyQ0E5QTQyM0Q5RjExRTQ4NTkxRTRDMTBFMEI2OTNCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkIyQ0E5QTQzM0Q5RjExRTQ4NTkxRTRDMTBFMEI2OTNCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QjJDQTlBNDAzRDlGMTFFNDg1OTFFNEMxMEUwQjY5M0IiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QjJDQTlBNDEzRDlGMTFFNDg1OTFFNEMxMEUwQjY5M0IiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAAGBAQEBQQGBQUGCQYFBgkLCAYG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";



class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            test: null,
            file: null,
            img64: "",
        };
        this.data = this.data.bind(this);
        //this.onFormSubmit = this.onFormSubmit.bind(this);
        this.getFiles = this.getFiles.bind(this);
    }
    //GCT5H6TEK7Q43EYJI6NWZ4DPGZXQUNFLW6VWD5EM4VSLUDNUA3AJNIKP
    //SDW4K7XQUERXDUJFJQFRPFF2XDE7IKBZGXWECCS2FYFE5AKDZO66XBFV
    async data(){
        /*
        const PlainTextContent = vstruct([
            { name: 'type', type: vstruct.UInt8 },
            { name: 'text', type: vstruct.VarString(vstruct.UInt16BE) },
        ]);

        const ReactContent = vstruct([
            { name: 'type', type: vstruct.UInt8 },
            { name: 'reaction', type: vstruct.UInt8 },
        ]);

        let a = {
          type: 1,
          text: "1231313123"
        };
        a = PlainTextContent.encode(a);
        a = ReactContent.decode(a);
        console.log(a);
        /*
        const Followings = vstruct([
            { name: 'addresses', type: vstruct.VarArray(vstruct.UInt16BE, vstruct.Buffer(35)) },
        ]);
        let value =  Buffer.from({
        type: "Buffer",
            data: [
            0,
            8,
            48,
            29,
            196,
            246,
            55,
            129,
            233,
            90,
            185,
            161,
            28,
            51,
            40,
            204,
            34,
            230,
            137,
            178,
            33,
            94,
            245,
            178,
            14,
            230,
            70,
            83,
            10,
            41,
            122,
            141,
            195,
            51,
            36,
            12,
            40,
            48,
            24,
            161,
            67,
            82,
            152,
            182,
            213,
            188,
            135,
            102,
            21,
            1,
            79,
            236,
            120,
            98,
            29,
            239,
            19,
            134,
            164,
            147,
            14,
            120,
            198,
            245,
            206,
            193,
            113,
            34,
            111,
            186,
            220,
            239,
            48,
            127,
            183,
            60,
            244,
            200,
            183,
            25,
            12,
            148,
            210,
            241,
            94,
            207,
            236,
            32,
            27,
            168,
            107,
            199,
            196,
            30,
            60,
            32,
            141,
            51,
            67,
            67,
            219,
            162,
            184,
            33,
            234,
            37,
            206,
            48,
            21,
            122,
            161,
            123,
            232,
            151,
            248,
            68,
            37,
            64,
            46,
            44,
            49,
            192,
            175,
            18,
            161,
            238,
            3,
            177,
            163,
            132,
            197,
            146,
            179,
            98,
            155,
            95,
            241,
            95,
            245,
            228,
            1,
            197,
            48,
            113,
            8,
            59,
            48,
            178,
            6,
            224,
            235,
            26,
            249,
            32,
            162,
            74,
            69,
            112,
            235,
            237,
            219,
            96,
            238,
            13,
            132,
            72,
            220,
            82,
            21,
            46,
            229,
            30,
            131,
            171,
            149,
            140,
            88,
            48,
            47,
            85,
            225,
            52,
            195,
            71,
            232,
            40,
            199,
            87,
            10,
            102,
            115,
            151,
            86,
            233,
            255,
            169,
            56,
            239,
            43,
            58,
            37,
            168,
            116,
            112,
            9,
            58,
            142,
            61,
            157,
            237,
            195,
            240,
            48,
            135,
            34,
            116,
            169,
            99,
            105,
            41,
            126,
            136,
            19,
            170,
            43,
            53,
            117,
            191,
            80,
            108,
            133,
            241,
            181,
            188,
            237,
            49,
            247,
            248,
            35,
            21,
            94,
            142,
            224,
            177,
            82,
            230,
            107,
            48,
            167,
            211,
            250,
            100,
            87,
            225,
            205,
            147,
            9,
            71,
            155,
            108,
            240,
            111,
            54,
            111,
            10,
            52,
            171,
            183,
            171,
            97,
            244,
            140,
            229,
            100,
            186,
            13,
            180,
            6,
            192,
            150,
            161,
            79
        ]
        });
        value = Followings.decode(value);
        for(let i =0; i<value.addresses.length; i++) {
            value.addresses[i] = base32.encode(value.addresses[i]);
        }
        console.log(value);
        /*
        let balance = 0;
        let bandwidthTime = 0;
        let bandwidth = 0;
        let data = await getData("https://komodo.forest.network", "GCT5H6TEK7Q43EYJI6NWZ4DPGZXQUNFLW6VWD5EM4VSLUDNUA3AJNIKP");
        for(let i=1; i<data.length; i++) {
            let tx = Buffer(data[i].tx, "base64");
            let txSize = tx.length;
            try {
                tx = decode(tx);
            }
            catch(error) {
                continue;
            }
            console.log(tx.params);
            console.log(hash(tx));
            if(tx.operation === "payment") {
                if(tx.account === "GCT5H6TEK7Q43EYJI6NWZ4DPGZXQUNFLW6VWD5EM4VSLUDNUA3AJNIKP") {
                    balance -= parseInt(tx.params.amount);
                    let time = await getTime("https://komodo.forest.network", data[i].height);
                    const energy = await getEnergy(balance, bandwidthTime, bandwidth, txSize, time);
                    bandwidthTime = time;
                    bandwidth = energy.bandwidth;
                }
                else {
                    balance += parseInt(tx.params.amount);
                    let time = await getTime("https://komodo.forest.network", data[i].height);
                    const energy = await getEnergy(balance, bandwidthTime, bandwidth, 0, time);
                    bandwidthTime = time;
                    bandwidth = energy.bandwidth;
                }
            }
            else {
                let time = await getTime("https://komodo.forest.network", data[i].height);
                const energy = await getEnergy(balance, bandwidthTime, bandwidth, txSize, time);
                bandwidthTime = time;
                bandwidth = energy.bandwidth;
            }
        }
        console.log("end");
        let time = await getLatestBlockTime("https://komodo.forest.network");
        const energy = await getEnergy(balance, bandwidthTime, bandwidth, 0, time);
        console.log(energy);
        */
        axios.get("https://komodo.forest.network/tx_search?query=%22account=%27" + public_key + "%27%22")
            .then(res => {
                let tx = Buffer(res.data.result.txs[28].tx, "base64");
                console.log(tx);
                tx = decode(tx);
                console.log(tx);
                //const s = Buffer.from(public_key, "utf8");
                //console.log(s.toString());
                //console.log(PlainTextContent.decode(tx.params.content));
                //const key = Keypair.fromSecret("SA23VEEUONZLTXME42JMJ2ULWREKISYTPZUJKL4ADW2HZCNREJZOBOSM");
                //console.log(key.publicKey());
            });
        //GB6GCNFCPYWPHBPVUARS4ANCTNLVDT726AXIQMPXPQVQMYWRN223BBIG
        //SA23VEEUONZLTXME42JMJ2ULWREKISYTPZUJKL4ADW2HZCNREJZOBOSM

        /*
        const PlainTextContent = vstruct([
            { name: 'type', type: vstruct.UInt8 },
            { name: 'text', type: vstruct.VarString(vstruct.UInt16BE) },
        ]);
        const Followings = vstruct([
            { name: 'addresses', type: vstruct.VarArray(vstruct.UInt16BE, vstruct.Buffer(35)) },
        ]);
        //let addresses = [ Buffer.from(base32.decode("GB6GCNFCPYWPHBPVUARS4ANCTNLVDT726AXIQMPXPQVQMYWRN223BBIG")), Buffer.from(base32.decode("GCZRPJNYGLR4VD3HROBGDUF4IIS32DAF5FNBRFRHUD4QCDE5ZKTEB37B"))];
        //console.log(addresses);
        //let value={addresses: addresses};
       // console.log(value);
        //value = Followings.encode(value);
        //console.log(value);

        let addresses = [ Buffer.from(base32.decode("GB6GCNFCPYWPHBPVUARS4ANCTNLVDT726AXIQMPXPQVQMYWRN223BBIG")),
            Buffer.from(base32.decode("GCZRPJNYGLR4VD3HROBGDUF4IIS32DAF5FNBRFRHUD4QCDE5ZKTEB37B")),
            Buffer.from(base32.decode("GAO4J5RXQHUVVONBDQZSRTBC42E3EIK66WZA5ZSGKMFCS6UNYMZSIDBI"))];

           */
        /*
        const tx = {
            version: 1,
            account: "GCT5H6TEK7Q43EYJI6NWZ4DPGZXQUNFLW6VWD5EM4VSLUDNUA3AJNIKP",
            sequence: 25,
            memo: Buffer.alloc(0),
            operation: 'interact',
            params: {
                object: 'AC489D70EDD851BA12E8563A507253758818DF91169495EC968729013546F34B',
                content: {
                    type: 1,
                    text: 'comment',
                }
            },
        };
        console.log(tx);
        sign(tx, 'SDW4K7XQUERXDUJFJQFRPFF2XDE7IKBZGXWECCS2FYFE5AKDZO66XBFV');
        console.log(tx);
        const etx = encode(tx).toString('hex');
        console.log("0x"+ etx);


        axios.post('https://komodo.forest.network/broadcast_tx_commit?tx=0x' + etx)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });

    }

    onFormSubmit(e){
        /*
        e.preventDefault();
        const formData = new FormData();
        formData.append('myImage',this.state.file);

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        const tx = {
            version: 1,
            account: public_key,
            sequence: 12,
            memo: Buffer.alloc(0),
            operation: 'update_account',
            params: {
                key: 'picture',
                //value: ,
            }
        };
        console.log(tx);
        sign(tx, 'SDW4K7XQUERXDUJFJQFRPFF2XDE7IKBZGXWECCS2FYFE5AKDZO66XBFV');
        console.log(tx);
        const etx = encode(tx).toString('hex');
        console.log("0x"+ etx);
        /*
        axios.post('https://komodo.forest.network/broadcast_tx_commit?tx=0x' + etx)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
           */
        /*
        axios.post("/upload",formData,config)
            .then((response) => {
                alert("The file is successfully uploaded");
            }).catch((error) => {
        });
        */
    }

    componentWillMount(){
        let tx = "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"
        this.setState({img64: tx});
    }

    getFiles(files){

        //console.log(files[0].base64);
        let a = files[0].base64;
        a = a.slice(23);
        //console.log(a);
        const tx = {
            version: 1,
            account: "GBNVADH6GARCNM5G4DBWK27D5SI6GIUC24VERZ3Q5VR5P53T7MJRUGRQ",
            sequence: 6,
            memo: Buffer.alloc(0),
            operation: 'update_account',
            params: {
                key: 'picture',
                value: Buffer.from(a, 'base64'),
            }
        };
        console.log(tx);
        console.log(123);
        sign(tx, 'SBGO2YJ5L3CXGWGLRQKGWUOSS5QS2D2WQCM6HQ6VNDQY6E4SBWFFPJAV');
        console.log(tx);
        //const etx = encode(tx).toString('hex');
        let dataEncoded = encode(tx).toString('base64');
        //dataEncoded = "0x" + dataEncoded;
        console.log(dataEncoded);
        //console.log("0x"+ etx);

        axios.post('https://komodo.forest.network/', {
            "jsonrpc": "2.0",
            "id": "1",
            "method": "broadcast_tx_commit",
            "params": [`${dataEncoded}`]
        })
            .then(res => console.log(res.data))
            .catch(err => console.log(err));

    }

    render() {
        return(
            <div className="container-fluid">
                <FileBase64
                    multiple={ true }
                    onDone={ this.getFiles } />
                <img src={"data:image/jpeg/png;base64," + this.state.img64} />
                <form onSubmit={this.onFormSubmit}>
                    <h1>File Upload</h1>
                    <input type="file" name="myImage" onChange= {this.onChange} />
                    <button type="submit">Upload</button>
                </form>
                <button onClick={this.data}>
                    Data
                </button>
            </div>
            );
        }
    }

export default compose(

)(Homepage)