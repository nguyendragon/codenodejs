import connection from '../configs/connectDB';
import handlingOrder from './handlingController';
const request = require('request');
const axios = require('axios').default;

const automomo = (cron) => {
    cron.schedule('*/5 * * * * *', async() => {
        const [temp] = await connection.execute('SELECT * FROM `temp`', []);
        let urlMomo = temp[0].callbackmomo;
        let urlBank = temp[0].callbackbank;
        // Banking
        axios.get(urlBank)
            .then(async(response) => {
                let data = response.data.MbMsg.TranList;
                const [listStatus0] = await connection.execute('SELECT `phone_login`,`money`, `ma_don`,`loai`, `status` FROM `recharge` WHERE `status` = 0 AND `loai` = "bank"', []);
                if (data) {
                    for (let i = 0; i < listStatus0.length; i++) {
                        for (let j = 0; j < data.length; j++) {
                            if (data[j].description.includes(listStatus0[i].ma_don) && listStatus0[i].loai == "bank" && listStatus0[i].money == data[j].creditAmount) {
                                await connection.execute('UPDATE `recharge` SET `status` = 1 WHERE `ma_don` = ? AND `loai` = "bank"', [listStatus0[i].ma_don]);
                                await connection.execute('UPDATE `users` SET `money` = `money` + ? WHERE `phone_login` = ? ', [listStatus0[i].money, listStatus0[i].phone_login]);
                            }
                        }

                    }
                }
                // handle success
            })
            .catch(function(error) {
                // handle error
                console.log(error);
            })
            // Momo
        axios.get(urlMomo)
            .then(async(response) => {
                let data = response.data.TranList;
                const [listStatus0] = await connection.execute('SELECT `phone_login`,`money`, `ma_don`,`loai`, `status` FROM `recharge` WHERE `status` = 0 AND `loai` = "momo"', []);
                if (data) {
                    for (let i = 0; i < listStatus0.length; i++) {
                        for (let j = 0; j < data.length; j++) {
                            if (listStatus0[i].ma_don == data[j].comment && listStatus0[i].loai == "momo" && listStatus0[i].money == data[j].amount) {
                                console.log(true);
                                await connection.execute('UPDATE `recharge` SET `status` = 1 WHERE `ma_don` = ? AND `loai` = "momo"', [listStatus0[i].ma_don]);
                                await connection.execute('UPDATE `users` SET `money` = `money` + ? WHERE `phone_login` = ? ', [listStatus0[i].money, listStatus0[i].phone_login]);
                            }
                        }

                    }
                }
                // handle success
            })
            .catch(function(error) {
                // handle error
                console.log(error);
            })
    }, {
        scheduled: true,
        timeZone: 'Asia/Ho_Chi_Minh'
    });
}

const parityCron = (cron, io) => {
    cron.schedule('*/10 * * * * *', async() => {
        await handlingOrder.add_tage_woipy();
        const [giai_doan] = await connection.execute('SELECT * FROM `tage_woipy` WHERE `ket_qua` = 0 ORDER BY `id` DESC LIMIT 1 ', []);
        const [orderbox] = await connection.execute('SELECT * FROM `tage_woipy` WHERE `ket_qua` != 0 ORDER BY `id` DESC LIMIT 1 ', []);
        const data = giai_doan[0]; // Cầu mới chưa có kết quả
        const data2 = orderbox[0]; // Cầu có kết quả khác 0
        io.emit('data-server', { data: data, data2: data2 });
    }, {
        scheduled: true,
        timeZone: 'Asia/Ho_Chi_Minh'
    });
}

module.exports = {
    automomo,
    parityCron,
}