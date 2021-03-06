import connection from '../configs/connectDB';

// Get time dạng: 14 Apr 2022, 20:40 pm
const TimeCreate = () => {
    var arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const dateNow = new Date();
    var day = dateNow.getDate() < 10 ? "0" + dateNow.getDate() : dateNow.getDate();
    var month = arr[dateNow.getMonth()];
    var year = dateNow.getFullYear();
    var hour = dateNow.getHours() < 10 ? "0" + dateNow.getHours() : dateNow.getHours();
    var minute = dateNow.getMinutes() < 10 ? "0" + dateNow.getMinutes() : dateNow.getMinutes();
    var time = hour + ":" + minute;
    var am_pm = "";
    if (dateNow.getHours() >= 12) {
        am_pm = "pm";
    } else {
        am_pm = "am";
    }
    return day + " " + month + " " + year + ". " + time + " " + am_pm;
}

const handlingOrder = async() => {
    // Lấy ra 1 giai đoạn trên đầu có kết quả khác 0
    const [giai_doan_khac_0] = await connection.execute('SELECT * FROM `tage_woipy` WHERE `ket_qua` != 0 ORDER BY `id` DESC LIMIT 1 ', []);
    const get_giai_doan_khac_0 = giai_doan_khac_0[0]; // VD: { id: 20,giai_doan: '20220413237',cau: '237', ket_qua: 205442 }
    let ket_qua_cau_truoc = get_giai_doan_khac_0.ket_qua; // VD: 205442
    const ket_qua = String(ket_qua_cau_truoc).split("")[5]; // VD: 2

    // update kết quả cho đơn hàng
    var time = TimeCreate();
    await connection.execute('UPDATE `order_woipy` SET `ket_qua` = ?, `time_end` = ? WHERE `status` = 0', [ket_qua_cau_truoc, time]);
    var ket_qua_N = Number(ket_qua);
    switch (ket_qua_N) {
        case 0:
            await connection.execute('UPDATE `order_woipy` SET `status` = 2 WHERE `status` = 0 AND `chon` != "d" AND `chon` != "0" AND `chon` != "t" ', []);
            break;
        case 1:
            await connection.execute('UPDATE `order_woipy` SET `status` = 2 WHERE `status` = 0 AND `chon` != "x" AND `chon` != "1" ', []);
            break;
        case 2:
            await connection.execute('UPDATE `order_woipy` SET `status` = 2 WHERE `status` = 0 AND `chon` != "d" AND `chon` != "2" ', []);
            break;
        case 3:
            await connection.execute('UPDATE `order_woipy` SET `status` = 2 WHERE `status` = 0 AND `chon` != "x" AND `chon` != "3" ', []);
            break;
        case 4:
            await connection.execute('UPDATE `order_woipy` SET `status` = 2 WHERE `status` = 0 AND `chon` != "d" AND `chon` != "4" ', []);
            break;
        case 5:
            await connection.execute('UPDATE `order_woipy` SET `status` = 2 WHERE `status` = 0 AND `chon` != "x" AND `chon` != "5" AND `chon` != "t" ', []);
            break;
        case 6:
            await connection.execute('UPDATE `order_woipy` SET `status` = 2 WHERE `status` = 0 AND `chon` != "d" AND `chon` != "6" ', []);
            break;
        case 7:
            await connection.execute('UPDATE `order_woipy` SET `status` = 2 WHERE `status` = 0 AND `chon` != "x" AND `chon` != "7" ', []);
            break;
        case 8:
            await connection.execute('UPDATE `order_woipy` SET `status` = 2 WHERE `status` = 0 AND `chon` != "d" AND `chon` != "8" ', []);
            break;
        case 9:
            await connection.execute('UPDATE `order_woipy` SET `status` = 2 WHERE `status` = 0 AND `chon` != "x" AND `chon` != "9" ', []);
            break;
        default:
            break;
    }

    // lấy ra danh sách đặt cược chưa xử lý
    const [order] = await connection.execute('SELECT * FROM `order_woipy` WHERE `status` = 0 ', []);
    for (let i = 0; i < order.length; i++) {
        const list_order = order[i]; // lấy ra danh sách chưa xử lý
        var ket_qu = Number(String(list_order.ket_qua).split("")[5]); // VD: 5 trong bảng đơn hàng
        var chon = list_order.chon; // VD: d,x,t,1,2 trong bảng đơn hàng
        var id = list_order.id; // VD: 1, 2, 3, 4,... trong bảng đơn hàng
        var giao_hang = list_order.giao_hang; // VD: Số tiền cược : 100k Giao Hàng: 96k Phí 4k
        var phone_login = list_order.phone_login; // VD: Số điện thoại
        var nhan_duoc = 0;
        if (ket_qu == 0 || ket_qu == 5) {
            if (chon == 'd' || chon == 'x') {
                nhan_duoc = giao_hang * 1.5;
            } else if (chon == 't') {
                nhan_duoc = giao_hang * 4.5;
            } else if (chon == "0" || chon == "5") {
                nhan_duoc = giao_hang * 9;
            }
        } else {
            if (ket_qu == 1 && chon == "1") {
                nhan_duoc = giao_hang * 9;
            } else {
                if (ket_qu == 1 && chon == 'x') {
                    nhan_duoc = giao_hang * 2;
                }
            }
            if (ket_qu == 2 && chon == "2") {
                nhan_duoc = giao_hang * 9;
            } else {
                if (ket_qu == 2 && chon == 'd') {
                    nhan_duoc = giao_hang * 2;
                }
            }
            if (ket_qu == 3 && chon == "3") {
                nhan_duoc = giao_hang * 9;
            } else {
                if (ket_qu == 3 && chon == 'x') {
                    nhan_duoc = giao_hang * 2;
                }
            }
            if (ket_qu == 4 && chon == "4") {
                nhan_duoc = giao_hang * 9;
            } else {
                if (ket_qu == 4 && chon == 'd') {
                    nhan_duoc = giao_hang * 2;
                }
            }
            if (ket_qu == 6 && chon == "6") {
                nhan_duoc = giao_hang * 9;
            } else {
                if (ket_qu == 6 && chon == 'd') {
                    nhan_duoc = giao_hang * 2;
                }
            }
            if (ket_qu == 7 && chon == "7") {
                nhan_duoc = giao_hang * 9;
            } else {
                if (ket_qu == 7 && chon == 'x') {
                    nhan_duoc = giao_hang * 2;
                }
            }
            if (ket_qu == 8 && chon == "8") {
                nhan_duoc = giao_hang * 9;
            } else {
                if (ket_qu == 8 && chon == 'd') {
                    nhan_duoc = giao_hang * 2;
                }
            }
            if (ket_qu == 9 && chon == "9") {
                nhan_duoc = giao_hang * 9;
            } else {
                if (ket_qu == 9 && chon == 'x') {
                    nhan_duoc = giao_hang * 2;
                }
            }
        }
        const sql3 = 'INSERT INTO `financial_details` SET `phone_login` = ?, `loai` = ?, `money` = ?, `time` = ?';
        await connection.execute(sql3, [phone_login, 2, nhan_duoc, time]);
        const [users] = await connection.execute('SELECT `money` FROM `users` WHERE `phone_login` = ?', [phone_login]);
        var total = users[0].money + nhan_duoc;
        await connection.execute('UPDATE `order_woipy` SET `nhan_duoc` = ?, `status` = 1 WHERE `id` = ? ', [nhan_duoc, id]);
        const sql = 'UPDATE `users` SET `money` = ? WHERE `phone_login` = ? ';
        await connection.execute(sql, [total, phone_login]);
    }
}

// Thêm cầu mới
const add_tage_woipy = async(req, res) => {
    // 0. Chờ
    // 1. Thắng
    // 2. Thua

    var time = TimeCreate();
    // lấy ra giai đoạn hiện tại
    const [giai_doan] = await connection.execute('SELECT * FROM `tage_woipy` WHERE `ket_qua` = 0 ORDER BY `id` DESC LIMIT 1 ', []);
    const get_giai_doan = giai_doan[0];
    // Giai đoạn mới 
    var giai_doan_moi = 0;
    var cau_moi = 0;
    if (get_giai_doan.cau == 480) {
        cau_moi = '1';
        giai_doan_moi = Number(get_giai_doan.giai_doan) + 521;
        await connection.execute('UPDATE `users` SET `status_login` = 0', []);
    } else {
        cau_moi = Number(get_giai_doan.cau) + 1;
        giai_doan_moi = Number(get_giai_doan.giai_doan) + 1;
    }
    const [get_ket_qua] = await connection.execute('SELECT `ket_qua`, `win_rate` FROM `temp` ', []);
    const [xanh] = await connection.execute('SELECT SUM(so_tien_cuoc) as xanh FROM `order_woipy` WHERE `status` = 0 AND `permission` = "user" AND `chon` = "x" ', []);
    // const [tim] = await connection.execute('SELECT SUM(so_tien_cuoc) as tim FROM `order_woipy` WHERE `status` = 0 AND `permission` = "user" AND `chon` = "t" ', []);
    const [dos] = await connection.execute('SELECT SUM(so_tien_cuoc) as dos FROM `order_woipy` WHERE `status` = 0 AND `permission` = "user" AND `chon` = "d" ', []);
    // const [khong] = await connection.execute('SELECT SUM(so_tien_cuoc) as khong FROM `order_woipy` WHERE `status` = 0 AND `permission` = "user" AND `chon` = "0" ', []);
    // const [mot] = await connection.execute('SELECT SUM(so_tien_cuoc) as mot FROM `order_woipy` WHERE `status` = 0 AND `permission` = "user" AND `chon` = "1" ', []);
    // const [hai] = await connection.execute('SELECT SUM(so_tien_cuoc) as hai FROM `order_woipy` WHERE `status` = 0 AND `permission` = "user" AND `chon` = "2" ', []);
    // const [ba] = await connection.execute('SELECT SUM(so_tien_cuoc) as ba FROM `order_woipy` WHERE `status` = 0 AND `permission` = "user" AND `chon` = "3" ', []);
    // const [bon] = await connection.execute('SELECT SUM(so_tien_cuoc) as bon FROM `order_woipy` WHERE `status` = 0 AND `permission` = "user" AND `chon` = "4" ', []);
    // const [nam] = await connection.execute('SELECT SUM(so_tien_cuoc) as nam FROM `order_woipy` WHERE `status` = 0 AND `permission` = "user" AND `chon` = "5" ', []);
    // const [sau] = await connection.execute('SELECT SUM(so_tien_cuoc) as sau FROM `order_woipy` WHERE `status` = 0 AND `permission` = "user" AND `chon` = "6" ', []);
    // const [bay] = await connection.execute('SELECT SUM(so_tien_cuoc) as bay FROM `order_woipy` WHERE `status` = 0 AND `permission` = "user" AND `chon` = "7" ', []);
    // const [tam] = await connection.execute('SELECT SUM(so_tien_cuoc) as tam FROM `order_woipy` WHERE `status` = 0 AND `permission` = "user" AND `chon` = "8" ', []);
    // const [chin] = await connection.execute('SELECT SUM(so_tien_cuoc) as chin FROM `order_woipy` WHERE `status` = 0 AND `permission` = "user" AND `chon` = "9" ', []);
    var update_kq = 0;

    function createKQ(params) {
        if (params == 0) {
            let chan = [
                205000, 205002, 205004, 205006, 205008, 205010, 205012, 205014, 205016, 205018, 205020, 205022, 205024, 205026, 205028, 205030, 205032, 205034, 205036, 205038, 205040, 205042, 205044, 205046, 205048, 205050, 205052, 205054, 205056, 205058, 205060, 205062, 205064, 205066, 205068, 205070, 205072, 205074, 205076, 205078, 205080, 205082, 205084, 205086, 205088, 205090, 205092, 205094, 205096, 205098, 205100, 205102, 205104, 205106, 205108, 205110, 205112, 205114, 205116, 205118, 205120, 205122, 205124, 205126, 205128, 205130, 205132, 205134, 205136, 205138, 205140, 205142, 205144, 205146, 205148, 205150, 205152, 205154, 205156, 205158, 205160, 205162, 205164, 205166, 205168, 205170, 205172, 205174, 205176, 205178, 205180, 205182, 205184, 205186, 205188, 205190, 205192, 205194, 205196, 205198, 205200, 205202, 205204, 205206, 205208, 205210, 205212, 205214, 205216, 205218, 205220, 205222, 205224, 205226, 205228, 205230, 205232, 205234, 205236, 205238, 205240, 205242, 205244, 205246, 205248, 205250, 205252, 205254, 205256, 205258, 205260, 205262, 205264, 205266, 205268, 205270, 205272, 205274, 205276, 205278, 205280, 205282, 205284, 205286, 205288, 205290, 205292, 205294, 205296, 205298, 205300, 205302, 205304, 205306, 205308, 205310, 205312, 205314, 205316, 205318, 205320, 205322, 205324, 205326, 205328, 205330, 205332, 205334, 205336, 205338, 205340, 205342, 205344, 205346, 205348, 205350, 205352, 205354, 205356, 205358, 205360, 205362, 205364, 205366, 205368, 205370, 205372, 205374, 205376, 205378, 205380, 205382, 205384, 205386, 205388, 205390, 205392, 205394, 205396, 205398, 205400, 205402, 205404, 205406, 205408, 205410, 205412, 205414, 205416, 205418, 205420, 205422, 205424,
                205426, 205428, 205430, 205432, 205434, 205436, 205438, 205440, 205442, 205444, 205446, 205448, 205450, 205452, 205454, 205456, 205458, 205460, 205462, 205464, 205466, 205468, 205470, 205472, 205474, 205476, 205478, 205480, 205482, 205484, 205486, 205488, 205490, 205492, 205494, 205496, 205498, 205500, 205502, 205504, 205506, 205508, 205510, 205512, 205514, 205516, 205518, 205520, 205522, 205524, 205526, 205528, 205530, 205532, 205534, 205536, 205538, 205540, 205542, 205544, 205546, 205548, 205550, 205552, 205554, 205556, 205558, 205560, 205562, 205564, 205566, 205568, 205570, 205572, 205574, 205576, 205578, 205580, 205582, 205584, 205586, 205588, 205590, 205592, 205594, 205596, 205598, 205600, 205602, 205604, 205606, 205608, 205610, 205612, 205614, 205616, 205618, 205620, 205622, 205624, 205626, 205628, 205630, 205632, 205634, 205636, 205638, 205640, 205642, 205644, 205646, 205648, 205650, 205652, 205654, 205656, 205658, 205660, 205662, 205664, 205666, 205668, 205670, 205672, 205674, 205676, 205678, 205680, 205682, 205684, 205686, 205688, 205690, 205692, 205694, 205696, 205698, 205700, 205702, 205704, 205706, 205708, 205710, 205712, 205714, 205716, 205718, 205720, 205722, 205724, 205726, 205728, 205730, 205732, 205734, 205736, 205738, 205740, 205742, 205744, 205746, 205748, 205750, 205752, 205754, 205756, 205758, 205760, 205762, 205764, 205766, 205768, 205770, 205772, 205774, 205776, 205778, 205780, 205782, 205784, 205786, 205788, 205790, 205792, 205794, 205796, 205798, 205800, 205802, 205804, 205806, 205808, 205810, 205812, 205814, 205816, 205818, 205820, 205822, 205824, 205826, 205828, 205830, 205832, 205834, 205836, 205838, 205840, 205842, 205844, 205846, 205848, 205850, 205852, 205854, 205856, 205858, 205860, 205862, 205864, 205866, 205868, 205870, 205872, 205874, 205876, 205878, 205880, 205882, 205884, 205886, 205888, 205890, 205892, 205894, 205896, 205898, 205900, 205902, 205904, 205906, 205908, 205910, 205912, 205914, 205916, 205918, 205920, 205922, 205924, 205926, 205928, 205930, 205932, 205934, 205936, 205938, 205940, 205942, 205944, 205946, 205948, 205950, 205952, 205954, 205956, 205958, 205960, 205962, 205964, 205966, 205968, 205970, 205972, 205974, 205976,
                205978, 205980, 205982, 205984, 205986, 205988, 205990, 205992, 205994, 205996, 205998
            ]
            let le = [
                205001, 205003, 205005, 205007, 205009, 205011, 205013, 205015, 205017, 205019, 205021, 205023, 205025, 205027, 205029, 205031, 205033, 205035, 205037, 205039, 205041, 205043, 205045, 205047, 205049, 205051, 205053, 205055, 205057, 205059, 205061, 205063, 205065, 205067, 205069, 205071, 205073, 205075, 205077, 205079, 205081, 205083, 205085, 205087, 205089, 205091, 205093, 205095, 205097, 205099, 205101, 205103, 205105, 205107, 205109, 205111, 205113, 205115, 205117, 205119, 205121, 205123, 205125, 205127, 205129, 205131, 205133, 205135, 205137, 205139, 205141, 205143, 205145, 205147, 205149, 205151, 205153, 205155, 205157, 205159, 205161, 205163, 205165, 205167, 205169, 205171, 205173, 205175, 205177, 205179, 205181, 205183, 205185, 205187, 205189, 205191, 205193, 205195, 205197, 205199, 205201, 205203, 205205, 205207, 205209, 205211, 205213, 205215, 205217, 205219, 205221, 205223, 205225, 205227, 205229, 205231, 205233, 205235, 205237, 205239, 205241, 205243, 205245, 205247, 205249, 205251, 205253, 205255, 205257, 205259, 205261, 205263, 205265, 205267, 205269, 205271, 205273, 205275, 205277, 205279, 205281, 205283, 205285, 205287, 205289, 205291, 205293, 205295, 205297, 205299, 205301, 205303, 205305, 205307, 205309, 205311, 205313, 205315, 205317, 205319, 205321, 205323, 205325, 205327, 205329, 205331, 205333, 205335, 205337, 205339, 205341, 205343, 205345, 205347, 205349, 205351, 205353, 205355, 205357, 205359, 205361, 205363, 205365, 205367, 205369, 205371, 205373, 205375, 205377, 205379, 205381, 205383, 205385, 205387, 205389, 205391, 205393, 205395, 205397, 205399, 205401, 205403, 205405, 205407, 205409, 205411, 205413, 205415, 205417, 205419, 205421, 205423, 205425, 205427, 205429, 205431, 205433, 205435, 205437, 205439, 205441, 205443, 205445, 205447, 205449, 205451, 205453, 205455, 205457, 205459, 205461, 205463, 205465, 205467, 205469, 205471, 205473, 205475, 205477, 205479, 205481, 205483, 205485, 205487, 205489, 205491, 205493, 205495, 205497, 205499, 205501, 205503, 205505, 205507, 205509, 205511, 205513, 205515, 205517, 205519, 205521, 205523, 205525, 205527, 205529, 205531, 205533, 205535, 205537, 205539, 205541, 205543, 205545, 205547, 205549, 205551, 205553, 205555, 205557, 205559, 205561, 205563, 205565, 205567, 205569, 205571, 205573, 205575, 205577, 205579, 205581, 205583, 205585, 205587, 205589, 205591, 205593, 205595,
                205597, 205599, 205601, 205603, 205605, 205607, 205609, 205611, 205613, 205615, 205617, 205619, 205621, 205623, 205625, 205627, 205629, 205631, 205633, 205635, 205637, 205639, 205641, 205643, 205645, 205647, 205649, 205651, 205653, 205655, 205657, 205659, 205661, 205663, 205665, 205667, 205669, 205671, 205673, 205675, 205677, 205679, 205681, 205683, 205685, 205687, 205689, 205691, 205693, 205695, 205697, 205699, 205701, 205703, 205705, 205707, 205709, 205711, 205713, 205715, 205717, 205719, 205721, 205723, 205725, 205727, 205729, 205731, 205733, 205735, 205737, 205739, 205741, 205743, 205745, 205747, 205749, 205751, 205753, 205755, 205757, 205759, 205761, 205763, 205765, 205767, 205769, 205771, 205773, 205775, 205777, 205779, 205781,
                205783, 205785, 205787, 205789, 205791, 205793, 205795, 205797, 205799, 205801, 205803, 205805, 205807, 205809, 205811, 205813, 205815, 205817, 205819, 205821, 205823, 205825, 205827, 205829, 205831, 205833, 205835, 205837, 205839, 205841, 205843, 205845, 205847, 205849, 205851, 205853, 205855, 205857, 205859, 205861, 205863, 205865, 205867, 205869, 205871, 205873, 205875, 205877, 205879, 205881, 205883, 205885, 205887, 205889, 205891, 205893, 205895, 205897, 205899, 205901, 205903, 205905, 205907, 205909, 205911, 205913, 205915, 205917, 205919, 205921, 205923, 205925, 205927, 205929, 205931, 205933, 205935, 205937, 205939, 205941, 205943, 205945, 205947, 205949, 205951, 205953, 205955, 205957, 205959, 205961, 205963, 205965, 205967, 205969, 205971, 205973, 205975, 205977, 205979, 205981, 205983, 205985, 205987, 205989, 205991, 205993, 205995, 205997, 205999
            ]

            let random = Math.floor(Math.random() * (100 - 1)) + 1;
            if (random <= get_ket_qua[0].win_rate) {
                console.log(0);
                return update_kq = Math.floor(Math.random() * (205999 - 205000)) + 205000; // Ra kết quả trong cầu cũ
            } else {
                let random = Math.floor(Math.random() * (499 - 0)) + 0;
                // let arrs = [
                //     { price: khong[0].khong, type: 'khong' },
                //     { price: mot[0].mot, type: 'mot' },
                //     { price: hai[0].hai, type: 'hai' },
                //     { price: ba[0].ba, type: 'ba' },
                //     { price: bon[0].bon, type: 'bon' },
                //     { price: nam[0].nam, type: 'nam' },
                //     { price: sau[0].sau, type: 'sau' },
                //     { price: bay[0].bay, type: 'bay' },
                //     { price: tam[0].tam, type: 'tam' },
                //     { price: chin[0].chin, type: 'chin' }
                // ];

                // const newArr = arrs.map(function myFunction(data, index) {
                //     return arrs[index].price != null;
                // })

                // var max = Math.max(...newArr);

                // function isChecked(arr, index) {
                //     return arr['price'] === max;
                // }
                // let data = arrs.find(isChecked);

                if (xanh[0].xanh > dos[0].dos) {
                    console.log(1);
                    return update_kq = chan[random];
                } else if (xanh[0].xanh < dos[0].dos) {
                    console.log(2);
                    return update_kq = le[random];
                } else {
                    console.log(3);
                    return update_kq = Math.floor(Math.random() * (205999 - 205000)) + 205000;
                }
            }
        } else {
            return update_kq = params;
        }
    }
    update_kq = await createKQ(get_ket_qua[0].ket_qua);
    const sql = 'INSERT INTO `tage_woipy` SET `giai_doan` = ?, `ket_qua` = 0, `cau` = ?, `time_create` = ?';
    const sql2 = 'UPDATE `tage_woipy` SET `ket_qua` = ?, `time_end` = ? WHERE `ket_qua` = 0';
    const sql3 = 'UPDATE `temp` SET `ket_qua` = ?';
    await connection.execute(sql2, [update_kq, time]);
    await connection.execute(sql3, [0]);
    await connection.execute(sql, [giai_doan_moi, cau_moi, time]);
    handlingOrder();
}

module.exports = {
    add_tage_woipy,
    handlingOrder,
}