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
    greeting: 'Em yêu,',
    closing: 'Mãi yêu em,',
    signature: 'Vanh',
    voiceSrc: '/audio/letter-voice.mp3',
    // Nội dung thư — mỗi phần tử là một đoạn văn
    paragraphs: [
      'Anh không giỏi nói những lời hoa mỹ, nhưng anh muốn em biết rằng em là điều tuyệt vời nhất đã đến trong cuộc đời anh.',
      'Có những ngày anh mệt, nhưng chỉ cần nghĩ đến em là anh lại thấy mọi thứ nhẹ nhàng hơn. Em là nơi anh muốn về sau mỗi ngày dài.',
      'Cảm ơn em vì đã luôn ở bên, vì đã chịu đựng anh, vì đã yêu anh theo cách của em. Anh biết anh không hoàn hảo, nhưng anh sẽ cố gắng mỗi ngày để xứng đáng hơn với em.',
      'Nhân ngày 20/10, anh chúc em luôn vui, luôn xinh, luôn hạnh phúc. Và hơn hết, anh chúc em luôn biết rằng — anh yêu em rất nhiều.',
    ],
  },

  // ── Gallery ──
  gallery: [
    // Thêm ảnh theo format: { src: '/images/tên-ảnh.jpg', caption: 'Mô tả', size: 'large' | 'medium' | 'small' }
    // size quyết định kích thước trong bento grid
    { src: '/images/gallery-1.jpg', caption: '', size: 'large' },
    { src: '/images/gallery-2.jpg', caption: '', size: 'medium' },
    { src: '/images/gallery-3.jpg', caption: '', size: 'small' },
    { src: '/images/gallery-4.jpg', caption: '', size: 'medium' },
    { src: '/images/gallery-5.jpg', caption: '', size: 'large' },
    { src: '/images/gallery-6.jpg', caption: '', size: 'small' },
  ],

  // ── Ảnh đôi ở trang đăng nhập ──
  couplePhoto: '/images/couple.jpg',       // Đặt ảnh vào public/images/

  // ── Favicon ──
  favicon: '/favicon.svg',
};

export default siteConfig;
