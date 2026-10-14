/**
 * Site Configuration — Tất cả nội dung cá nhân hóa nằm ở đây.
 * Chỉnh sửa file này để thay đổi mật khẩu, tên, nội dung thư, ảnh, nhạc, v.v.
 */

const siteConfig = {
  // ── Mật khẩu mở khóa website ──
  password: '8241',              // Mật khẩu bằng số — thay bằng số bạn muốn
  trimPassword: true,           // Bỏ khoảng trắng đầu cuối khi so sánh
  maxAttempts: 5,               // Số lần nhập sai trước khi hiện thẻ cào

  // ── Thông tin cá nhân ──
  herName: 'Em',                // Tên người yêu
  myName: 'Anh',                // Tên bạn
  coupleCaption: 'Us, somewhere in time.',  // Caption ảnh đôi ở trang đăng nhập
  notificationEmail: 'vanhlenorthside@gmail.com',        // Điền email của bạn (ví dụ: 'tenban@gmail.com') để nhận điều ước & góp ý qua email

  // ── Trang chủ ──
  greeting: 'Hế lô Su iu',
  occasion: 'Vietnamese Women\'s Day ♥',
  introText: 'Bất ngờ khôm',

  // ── Music ──
  music: {
    title: 'Vanh Lê',
    description: 'Nghe và khen',
    audioSrc: '/audio/song.mp3',           // Đặt file mp3 vào public/audio/
    coverSrc: '/images/music-cover.jpg',   // Đặt ảnh cover vào public/images/
  },

  // ── Letter ──
  letter: {
    greeting: 'Su iu,',
    closing: 'Iu thương Su,',
    signature: 'Vanh',
    voiceSrc: '/audio/letter-voice.mp3',
    // Nội dung thư — mỗi phần tử là một đoạn văn
    paragraphs: [
      'Anh chào bé iu nha, anh bắt đầu viết lá thứ này vô ngày 13/10/2026 là cái đêm mà anh trằn trọc thức tới sáng lun tại bởi vì anh có nhiều điều muốn nói quá nên anh chỉ mở đầu như thế này thui, tại giờ anh mắc lựa quà cho em rùi hehe.',
      'Lại chào bé iu nha, nay là ngày 14/10/2026, nay anh rảnh anh sẽ nói ra hết nỗi lòng của mình với em lun, tại vì những ngày tháng sau này anh sợ anh bận hay là anh đi gặp em anh sẽ bỏ quên chiếc lá thư này, nên hôm nay anh phải hoàn thiện nó luôn cũng như là xong những phần anh luôn để ý trong đầu nay đã phơi bày cho bé nghe, mong bé sẽ đọc hết nha ♥.',
      'Lời nói đầu cũng luôn là chữ cảm ơn, thực ra trong giai đoạn mình yêu nhau khá lâu nên những lúc anh bận bây giờ có thể lấy được hết cái nhiệt tình trong người để nói ra cũng nhờ em, nên là anh cảm ơn em vì những ngày tháng qua chịu đựng anh, phát triển hơn vì anh, và 1 điều nữa là cảm ơn em vì gợi ý cho anh cái ý tưởng này cho dù nó ko có quá đặc biệt, hôm bữa em kêu “anh viết thư i” nên anh bày ra 1 cái project này, thực sự mà nói thì anh luôn nghĩ nhiều ngày qua anh phải nghĩ ý tưởng webapps hay là cách kiếm tiền bao quanh việc duy trì niềm vui khi ở với em mà anh quên mất làm cho em mới là đáng giá nhất, mà anh thấy đúng là vậy thiệt, nên khi anh hoàn thành nó anh cũng cảm thấy tự hào về bản thân, kiểu tự hào về những kiến thức nay được áp dụng, điều đó cũng chứng minh là em khiến anh tự tin cũng như là tự anh thấy tự hào về bản thân mình, và cuối cùng luôn là cảm ơn em vì đã yêu anh.',
      'Thì thêm một 20/10 nữa diễn ra, anh mong em sáp cuối năm nay lại hạnh phúc hơn, cũng mong gia đình em luôn mạnh khoẻ như thế để em yên tâm lo cho bản thân và sự nghiệp của chính em, anh chỉ mong em là chính em thui em đừng dốc công sức mà cảm thấy mình đi quá giới hạn, cũng mong em hoàn thành mong muốn đầu tư đầu tay của em, anh sẽ luôn mong nó luôn luôn suôn sẻ vì em làm gì cũng có anh đây ời. Vô số lần mình đôi co là chuyện bình thường thui vì có lần nào mình bỏ nhau thật sự đâu, mình dính lấy nhau thiệt ròi, anh còn tin 100% sợi tơ tình này ko thể đứt được em ạ, cho nên hãy thật mạnh giỏi nha anh iu em nhiều lắm bé iu ưi. Chúc em iu xinh đệp nhá ♥',
    ],
  },

  // ── Gallery ──
  gallery: [
    // Thêm ảnh theo format: { src: '/images/tên-ảnh.jpg', caption: 'Mô tả', size: 'large' | 'medium' | 'small' }
    // size quyết định kích thước trong bento grid
    { src: '/images/gallery-1.jpg', caption: 'Ngày em va vào anh', size: 'large' },
    { src: '/images/gallery-2.jpg', caption: 'Ôm nhao trong museum', size: 'medium' },
    { src: '/images/gallery-3.jpg', caption: 'Lần đầu tiên biết handmade', size: 'small' },
    { src: '/images/gallery-4.jpg', caption: 'Ngày em quay lưng với anh', size: 'medium' },
    { src: '/images/gallery-5.jpg', caption: 'Trai tài gái sắc part 1', size: 'large' },
    { src: '/images/gallery-6.jpg', caption: 'Lần đầu làm chuyện ấy', size: 'small' },
    { src: '/images/gallery-7.jpg', caption: 'Tiểu phẩm thiếp và chàng', size: 'small' },
    { src: '/images/gallery-8.jpg', caption: 'Xoa đầu thú cưng', size: 'small' },
    { src: '/images/gallery-9.jpg', caption: 'Dáng em xinh trong giáng sinh', size: 'small' },
    { src: '/images/gallery-10.jpg', caption: 'Nông dân to hơn cô bộ đội', size: 'small' },
    { src: '/images/gallery-11.jpg', caption: 'Photobooth chạy bằng cơm với em', size: 'small' },
    { src: '/images/gallery-12.jpg', caption: 'Ngày mà anh thắng đời 1-0', size: 'small' },
    { src: '/images/gallery-13.jpg', caption: 'Vanh Su và truyền thuyết thành phố nước', size: 'small' },
    { src: '/images/gallery-14.jpg', caption: 'Ngày tôi trao cô ấy chiếc điện thoại mà cô ấy ruồng bỏ', size: 'small' },
    { src: '/images/gallery-15.jpg', caption: 'Trai tài gái sắc part 2', size: 'small' },
    { src: '/images/gallery-16.jpg', caption: 'Diễu binh diễu hành', size: 'small' },
    { src: '/images/gallery-17.jpg', caption: 'Biển đảo và em part 1', size: 'small' },
    { src: '/images/gallery-18.jpg', caption: 'Biển đảo và em part 2', size: 'small' },
    { src: '/images/gallery-19.jpg', caption: 'Ảnh chân dung thú cưng 2026', size: 'small' },
  ],

  // ── Ảnh đôi ở trang đăng nhập ──
  couplePhoto: '/images/couple.jpg',       // Đặt ảnh vào public/images/

  // ── Favicon ──
  favicon: '/favicon.svg',
};

export default siteConfig;
