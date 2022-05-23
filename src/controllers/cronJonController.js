import connection from '../configs/connectDB';
import handlingOrder from './handlingController';
const request = require('request');

const automomo = (cron) => {
    cron.schedule('*/10 * * * * *', () => {
        request('https://apimomo025.000webhostapp.com/controller/momo/api.php?act=getHistories&type=1', async(error, response, body) => {
            if (JSON.stringify(body).length != 4) {
                const list = JSON.parse(body).TranList;
                const quantity = list.length;
                const [listStatus0] = await connection.execute('SELECT `phone_login`,`money`, `ma_don`,`loai`, `status` FROM `recharge` WHERE `status` = 0', []);
                for (let i = 0; i < listStatus0.length; i++) {
                    for (let j = 0; j < quantity; j++) {
                        if (list[j].comment == listStatus0[i].ma_don && listStatus0[i].loai == "momo" && listStatus0[i].money == list[j].amount) {
                            await connection.execute('UPDATE `recharge` SET `status` = 1 WHERE `ma_don` = ? ', [listStatus0[i].ma_don]);
                            await connection.execute('UPDATE `users` SET `money` = `money` + ? WHERE `phone_login` = ? ', [list[j].amount, listStatus0[i].phone_login]);
                        }
                    }
                }
            }
        });
    }, {
        scheduled: true,
        timeZone: 'Asia/Ho_Chi_Minh'
    });
}

const parityCron = (cron, io) => {
    cron.schedule('*/3 * * * *', async() => {
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