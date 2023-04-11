const express = require('express')
const expressHbs = require('express-handlebars');
const port = 3000
// const multer = require('multer');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.engine('.handlebars', expressHbs.engine());
app.set('view engine', '.handlebars');

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://huuthiem:Anhthiem123@cluster0.vppscm2.mongodb.net/Cp17302?retryWrites=true&w=majority')
  .then(() => console.log('Kết nối thành công')) // then catch dùng để xử lý kết quả kết nối có thành công hay không
  .catch((err) => console.log(err));

const SinhVienModel = require('./SinhVienModel');
const LoginModel = require('./LoginModel');
const { Collection } = require('mongodb');

app.get('/list', async (req, res) => {
  try {
    let users = await SinhVienModel.find({}); // truy vấn bản ghi trong cơ sở dữ liệu
    users = users.map((user) => user.toObject());// Sau đó, nó chuyển đổi kết quả truy vấn thành đối tượng JavaScript thông qua toObject() .
    res.render('list', { users }); //và trả về trang web dưới dạng HTML sử dụng res.render()
  } catch (err) {
    console.log(err);
    res.status(500).send('Lỗi');
  }
});

app.get('/dangKy', (req, res) => {
  res.render('dangKy');
});

app.post('/dangKy', async (req, res) => {

  const data = {
    username: req.body.username,
    password: req.body.password
  }
  await LoginModel.insertMany([data]);
  res.render('login');

});

app.get('/', async (req, res) => {
  res.render('login');
});

app.post('/dangNhap', async (req, res) => {
  try {
    const check = await LoginModel.findOne({ username: req.body.username })
    if (check.password === req.body.password) {
      let users = await SinhVienModel.find({}); // truy vấn bản ghi trong cơ sở dữ liệu
      users = users.map((user) => user.toObject());// Sau đó, nó chuyển đổi kết quả truy vấn thành đối tượng JavaScript thông qua toObject() .
      res.render('list', { users });
      // res.render('list');
    } else {
      res.send("Sai mật khẩu");
    }
  } catch (error) {
    res.send("Chưa có tên tài khoản giống thế")
  }
})

app.get('/add', (req, res) => {
  res.render('add'); // trả về một trang html
});

app.post('/them', async (req, res) => { // thêm một đối tượng vào CSDL
  await SinhVienModel.create(req.body); // thêm đối tượng mới vào CSDL
  let users = await SinhVienModel.find({}); // khi thêm nó sẽ lưu vào users
  res.render('list', { users });// rồi nó cập nhật đến trang html list với dữ liệu là user
  res.redirect('/list'); // chuyển hướng đến trang chủ
});

app.get('/update', async (req, res) => {
  res.render('update');
});
// Route xử lý dữ liệu từ form
app.post('/update/:id', async (req, res) => {
  const id = req.params.id; // Lấy giá trị id từ URL parameter
  const updatedData = req.body; // Lấy dữ liệu cần cập nhật từ request body

  // Sử dụng phương thức updateOne của SinhVienModel để cập nhật dữ liệu
  SinhVienModel.updateOne({ _id: id }, updatedData)
    .then(() => {
      res.redirect('/list'); // Chuyển hướng về trang danh sách sau khi cập nhật thành công
    })
    .catch((err) => {
      console.error(err); // Xử lý lỗi nếu có
      res.status(500).send('Có lỗi xảy ra'); // Gửi phản hồi lỗi về client
    });
});



// app.get('/update', async (req, res) => {
//   await SinhVienModel.create(req.body); // thêm đối tượng mới vào CSDL
//   let users = await SinhVienModel.updateOne({}); // khi thêm nó sẽ lưu vào users
//   res.render('list', { users }); // rồi nó cập nhật đến trang html list với dữ liệu là user
//   res.redirect('/list'); // chuyển hướng đến trang chủ
// });




app.get('/delete', (req, res) => {
  res.render('delete');
});

//'/delete/:id' là một đường dẫn có tham số :id được truyền vào địa chỉ URL
// để xác định đối tượng SinhVien sẽ bị xóa khỏi cơ sở dữ liệu.
// app.get('/delete/:id', async (req, res) => {
//   await SinhVienModel.findByIdAndDelete(req.params.id);
//   res.redirect('/');
// });

app.get('/delete/:id', async (req, res) => {
  await SinhVienModel.findByIdAndDelete(req.params.id);
  res.redirect('/list');
});





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});