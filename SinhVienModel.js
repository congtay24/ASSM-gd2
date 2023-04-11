const mongoose = require('mongoose');
const  SinhVienSchema = new mongoose.Schema({
    maSP: {
        type: String,
    },
    tenSP: {
        type: String,
    },
    giaSP: {
        type: Number,
    },
    anh: {
        type: String,
    }, 
    mauSP: {
        type: String,
    }
});

const SinhVienModel = new mongoose.model('sinhvien', SinhVienSchema);
module.exports = SinhVienModel;