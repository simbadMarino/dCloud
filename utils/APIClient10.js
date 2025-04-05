import xhr from "axios/index";
//import { MULTIPLE_CURRENCY_RATE} from "utils/constants";
import Cookies from 'js-cookie';


class APIClient10 {
    constructor() {
        this.apiUrl = "http://localhost:5001";
        //this.apiUrl = "http://";
        this.token = Cookies.get(this.apiUrl) || '';
        // console.log("Token used:", this.token);
        this.request = async (url, body, config) => {
            const isFormData = body instanceof FormData
            const addToken = url.includes('?') ? `&token=${this.token}` : `?token=${this.token}`
            return new Promise(async (resolve, reject) => {
                try {

                    let { data } = await xhr.post(
                        this.apiUrl + url + addToken,
                        isFormData ? body :
                            {
                                ...body
                            },
                        { ...config }
                    );

                    resolve(data);
                    //console.log(data);

                }
                catch (e) {
                    // console.log(e);
                    let message;
                    if (e.response && e.response.status === 401) {
                        message = e.response['data'];
                        //window.location.href = '/#/login';
                    }
                    if (e.response && e.response.status === 500) {
                        message = e.response['data']['Message'];
                    }
                    if (e.response && e.response.status === 400) {
                        message = e.response['data'];
                    }

                    if (e.response && e.response?.data && !e.response?.data?.success && e.response?.data?.type === 'application/json') {
                        const fileReader = new FileReader()
                        fileReader.readAsText(e.response.data, 'utf-8')
                        fileReader.onload = function () {
                            const result = JSON.parse(fileReader.result)
                            message = result['Message']
                            resolve({
                                Type: 'error',
                                Message: message ? message : 'network error or host version not up to date'
                            });
                            return;
                        }
                    } else {
                        resolve({
                            Type: 'error',
                            Message: message ? message : 'network error or host version not up to date'
                        });
                    }
                }
            }).catch(err => {
                //console.log(err)
            });
        }
    }


    setApiUrl(url) {
        this.apiUrl = url;
    }

    getHostVersion() {
        return this.request('/api/v1/version');
    }

    getHostInfo() {
        return this.request('/api/v1/id');
    }

    getHostScore() {
        return this.request('/api/v1/storage/stats/info?l=false');
    }

    getHostPrice() {
        return this.request('/api/v1/cheque/price');
    }

    getHostScoreHistory(from, to) {
        return this.request('/api/v1/storage/stats/list?arg=' + from + '&arg=' + to);
    }

    getHostConfig() {
        return this.request('/api/v1/config/show');
    }

    getNetworkStatus() {
        return this.request('/api/v1/network');

    }

    getChainInfo() {
        return this.request('/api/v1/cheque/chaininfo');
    }

    getChequeAddress() {
        return this.request('/api/v1/vault/address');
    }

    getChequeBookBalance() {
        return this.request('/api/v1/vault/balance');
    }

    getChequeBTTBalance(address) {
        return this.request('/api/v1/cheque/bttbalance?arg=' + address);
    }

    getChequeWBTTBalance(address) {
        return this.request('/api/v1/vault/wbttbalance?arg=' + address);
    }

    getChequeValue() {
        return this.request('/api/v1/settlement/list');
    }

    getChequeStats() {
        return this.request('/api/v1/cheque/stats');
    }

    getChequeTotalIncomeNumbers() {
        return this.request('/api/v1/cheque/receive-total-count');
    }

    getContractsNumber() {
        return this.request('/api/v1/storage/contracts/stat?arg=host');
    }

    getChequeTotalExpenseNumbers() {
        return this.request('/api/v1/cheque/send-total-count');
    }

    getChequeCashingList(offset, limit) {
        return this.request('/api/v1/cheque/receivelist?arg=' + offset + '&arg=' + limit);
    }

    getChequeCashingHistoryList(offset, limit) {
        return this.request('/api/v1/cheque/cashlist?arg=' + offset + '&arg=' + limit);
    }

    getChequeReceivedDetailList(offset, limit) {
        return this.request('/api/v1/cheque/receive-history-list?arg=' + offset + '&arg=' + limit);
    }

    getChequeExpenseList() {
        return this.request('/api/v1/cheque/sendlist');
    }

    getChequeSentDetailList(offset, limit) {
        return this.request('/api/v1/cheque/send-history-list?arg=' + offset + '&arg=' + limit);
    }

    getChequeEarningHistory() {
        return this.request('/api/v1/cheque/receive-history-stats');
    }

    getChequeExpenseHistory() {
        return this.request('/api/v1/cheque/send-history-stats');
    }

    getFilesStorage() {
        return this.request('/api/v1/repo/stat?human=true');
    }

    getContracts() {
        return this.request('/api/v1/storage/contracts/list/host');
    }

    getNetworkFlow() {
        return this.request('/api/v1/stats/bw');
    }

    getPeers() {
        return this.request('/api/v1/swarm/peers?latency=true');
    }

    getRootHash() {
        return this.request('/api/v1/files/stat?arg=%2F');
    }

    getHashByPath(path) {
        return this.request('/api/v1/files/stat?arg=' + path);
    }

    getRepo() {
        return this.request('/api/v1/repo/stat');
    }

    changeRepo(path, volume) {
        return this.request('/api/v1/storage/path?arg=' + path + '&arg=' + volume);
    }

    getFiles(hash) {
        return this.request('/api/v1/ls?arg=' + hash);
    }
    mkdir(dir) {
        return this.request('/api/v1/files/mkdir?parents=true&arg=' + dir)
    }

    getFileStat(hash) {
        return this.request('/api/v1/files/stat?arg=/btfs/' + hash);
    }

    getFolder(hash, body, config) {
        return this.request('/api/v1/get?arg=' + hash + '&archive=true', body, config);
    }

    catFile(hash, body, config) {
        return this.request('/api/v1/cat?arg=' + hash, body, config);
    }

    getPrivateKey() {
        return this.request('/api/v1/cheque/chaininfo');
    }

    withdraw(amount) {
        return this.request('/api/v1/vault/withdraw?arg=' + amount);
    }

    deposit(amount) {
        return this.request('/api/v1/vault/deposit?arg=' + amount);
    }

    BTTTransfer(to, amount) {
        return this.request('/api/v1/bttc/send-btt-to?arg=' + to + '&arg=' + amount);
    }

    WBTTTransfer(to, amount) {
        return this.request('/api/v1/bttc/send-wbtt-to?arg=' + to + '&arg=' + amount);
    }

    BTT2WBTT(amount) {
        return this.request('/api/v1/bttc/btt2wbtt?arg=' + amount);
    }

    WBTT2BTT(amount) {
        return this.request('/api/v1/bttc/wbtt2btt?arg=' + amount);
    }

    cash(id) {
        return this.request('/api/v1/cheque/cash?arg=' + id);
    }

    addPeer(id) {
        return this.request('/api/v1/swarm/connect?arg=' + id);
    }

    copy(from, to) {
        return this.request('/api/v1/files/cp?arg=' + from + '&arg=' + to);
    }

    remove(hash) {
        return this.request('/api/v1/rm?arg=' + hash);
    }

    syncContracts() {
        return this.request('/api/v1/storage/contracts/sync/host');
    }

    enableHostMode(en) {
        return this.request('/api/v1/config/storage-host-enable?arg=' + en);
    }

    enableStorageSaver(en) {
        return this.request('/api/v1/config?arg=Experimental.FilestoreEnabled&arg=' + en + '&json=true');
        //"http://localhost:5001/api/v1/config?arg=Experimental.FilestoreEnabled&arg=false&json=true"
    }
    disableAuthToken() {
        return this.request('/api/v1/config?arg=API.EnableTokenAuth&arg=false&bool=false&json=true');

    }

    requestGuide() {
        return this.request('/api/v1/guide-info')
    }

    getUploadStatus(sessionID) {
        return this.request('/api/v1/storage/upload/status?arg=' + sessionID)
    }

    generalCommand(cmd) {
        return this.request(cmd)
    }

}

const Client10 = new APIClient10();

export default Client10;
