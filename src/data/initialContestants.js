// Initial 20 contestants with Thai names, creative wishes, avatars, and krathong styles
export const INITIAL_CONTESTANTS = [
  {
    id: "krathong-01",
    name: "น้องมะลิ พรประเสริฐ",
    wish: "ขอขมาพระแม่คงคา ขอให้ครอบครัวมีความสุข สุขภาพแข็งแรง การเรียนราบรื่น และพบเจอแต่กัลยาณมิตรที่ดีตลอดไป",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Mali&hair=long01&skinColor=f2d3b1",
    style: "classic-banana",
    votes: 428,
    createdAt: "2026-11-20T10:15:00.000Z",
    initialPos: { x: -8, z: -10 }
  },
  {
    id: "krathong-02",
    name: "พี่กานต์ & ครอบครัว",
    wish: "ขอให้กิจการค้าขายเจริญรุ่งเรือง ไร้โรคภัยเบียดเบียน ปลดหนี้มีโชคใหญ่ ร่ำรวยเงินทองและรอยยิ้ม",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=KarnFamily&hair=short02&skinColor=ecad80",
    style: "golden-royal",
    votes: 395,
    createdAt: "2026-11-20T10:20:00.000Z",
    initialPos: { x: -14, z: -4 }
  },
  {
    id: "krathong-03",
    name: "คุณยายทองใบ สดใส",
    wish: "ขอขมาสายน้ำที่ได้ใช้อุปโภคบริโภค ขอพรให้ลูกหลานทุกคนเจริญในหน้าที่การงาน อายุมั่นขวัญยืน",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=YaiTongbai&hair=long04&skinColor=f2d3b1",
    style: "pink-lotus",
    votes: 362,
    createdAt: "2026-11-20T10:35:00.000Z",
    initialPos: { x: -4, z: -15 }
  },
  {
    id: "krathong-04",
    name: "น้องฟ้าใส ใจบริสุทธิ์",
    wish: "ขอให้สอบติดคณะในฝัน ได้เป็นคุณหมอรักษาผู้คน และขอให้โลกใบนี้มีแต่สันติสุข",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Fahsai&hair=long02&skinColor=f2d3b1",
    style: "cyan-celestial",
    votes: 310,
    createdAt: "2026-11-20T10:42:00.000Z",
    initialPos: { x: 3, z: -8 }
  },
  {
    id: "krathong-05",
    name: "กลุ่มเพื่อนพ้อง ศิษย์มีครู",
    wish: "ขอให้มิตรภาพยืนยาว ไม่ว่าจะอยู่ที่ไหนขอให้คิดถึงกัน ประสบความสำเร็จในทางที่เลือกทุกคน",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=FriendsGang&hair=short01&skinColor=d08b5b",
    style: "rainbow-festival",
    votes: 289,
    createdAt: "2026-11-20T10:50:00.000Z",
    initialPos: { x: 10, z: -12 }
  },
  {
    id: "krathong-06",
    name: "ลุงสนั่น ทันยุค",
    wish: "ลอยทุกข์ ลอยโศก ลอยโรค ลอยภัย สิ่งใดไม่ดีขอให้ไหลไปกับสายน้ำ นำพาแต่สิ่งดีงามเข้ามา",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=UncleSanan&hair=short05&skinColor=ecad80",
    style: "classic-banana",
    votes: 275,
    createdAt: "2026-11-20T11:05:00.000Z",
    initialPos: { x: -20, z: -2 }
  },
  {
    id: "krathong-07",
    name: "แพรวา พาเพลิน",
    wish: "ขอให้ความรักสมหวังสดใส ได้เจอคนที่รักจริงและเคียงข้างกัน และงานออกแบบผ่านฉลุยทุกโปรเจกต์",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Praewa&hair=long03&skinColor=f2d3b1",
    style: "pink-lotus",
    votes: 264,
    createdAt: "2026-11-20T11:15:00.000Z",
    initialPos: { x: 16, z: -6 }
  },
  {
    id: "krathong-08",
    name: "พี่ต้นกล้า คนรักธรรมชาติ",
    wish: "ขอขมาพระแม่คงคา ขอร่วมรักษ์สิ่งแวดล้อม แม่น้ำใสสะอาด สัตว์น้ำปลอดภัย ธรรมชาติยั่งยืน",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=TonklaGreen&hair=short03&skinColor=d08b5b",
    style: "classic-banana",
    votes: 248,
    createdAt: "2026-11-20T11:22:00.000Z",
    initialPos: { x: -2, z: -6 }
  },
  {
    id: "krathong-09",
    name: "ไอซ์ & บีม คู่รักหวานแหวว",
    wish: "ขอให้ความรักของเราสองคนมั่นคงดั่งขุนเขา ไหลเย็นดั่งสายน้ำ อยู่เคียงข้างกันตลอดไป",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=IceBeam&hair=short04&skinColor=ecad80",
    style: "pink-lotus",
    votes: 231,
    createdAt: "2026-11-20T11:30:00.000Z",
    initialPos: { x: 7, z: -18 }
  },
  {
    id: "krathong-10",
    name: "เศรษฐีใหม่ พันล้าน",
    wish: "ขอโชคลาภเงินทองไหลมาเทมาไม่ขาดสาย ลงทุนสิ่งใดขอให้งอกเงย มีเหลือกินเหลือใช้และได้ทำบุญสร้างกุศล",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Billionaire&hair=short01&skinColor=f2d3b1",
    style: "golden-royal",
    votes: 219,
    createdAt: "2026-11-20T11:40:00.000Z",
    initialPos: { x: -11, z: -17 }
  },
  {
    id: "krathong-11",
    name: "พิมพ์มาดา ดาราเรือง",
    wish: "ขอให้มีสติปัญญาแจ่มใส ประสบความสำเร็จในหน้าที่การงาน เป็นที่รักของเจ้านายและเพื่อนร่วมงาน",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Pimmada&hair=long05&skinColor=f2d3b1",
    style: "cyan-celestial",
    votes: 198,
    createdAt: "2026-11-20T11:55:00.000Z",
    initialPos: { x: -16, z: -12 }
  },
  {
    id: "krathong-12",
    name: "เด็กชายวินมอเตอร์สปอร์ต",
    wish: "ขอให้ได้ของเล่นชิ้นใหม่ที่คุณแม่อยากซื้อให้ และขอให้ได้เกรดสี่วิชาคณิตศาสตร์ครับ!",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=BoyWin&hair=short02&skinColor=d08b5b",
    style: "rainbow-festival",
    votes: 185,
    createdAt: "2026-11-20T12:05:00.000Z",
    initialPos: { x: 12, z: -15 }
  },
  {
    id: "krathong-13",
    name: "สายธาร สุขสำราญ",
    wish: "ขออธิษฐานให้จิตใจสงบร่มเย็น มีความสุขกับสิ่งเรียบง่ายรอบตัว ปล่อยวางความเครียดทุกประการ",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Saithan&hair=long01&skinColor=ecad80",
    style: "cyan-celestial",
    votes: 172,
    createdAt: "2026-11-20T12:18:00.000Z",
    initialPos: { x: -6, z: -22 }
  },
  {
    id: "krathong-14",
    name: "ผู้ใหญ่บ้านสมเกียรติ",
    wish: "ขอให้ชุมชนของเรามีความสามัคคี ปลอดภัย ร่มเย็นเป็นสุข พืชผลทางการเกษตรได้ผลผลิตงอกงาม",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=PhuyaiSomkiat&hair=short05&skinColor=d08b5b",
    style: "classic-banana",
    votes: 160,
    createdAt: "2026-11-20T12:30:00.000Z",
    initialPos: { x: 2, z: -25 }
  },
  {
    id: "krathong-15",
    name: "นิตยา ยิ้มหวาน",
    wish: "ขอให้ปีนี้เป็นปีแห่งการเริ่มต้นใหม่ที่ดี ก้าวข้ามอุปสรรคทั้งปวง และพบเจอแต่โอกาสอันทรงคุณค่า",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Nittaya&hair=long03&skinColor=f2d3b1",
    style: "pink-lotus",
    votes: 147,
    createdAt: "2026-11-20T12:45:00.000Z",
    initialPos: { x: 18, z: -11 }
  },
  {
    id: "krathong-16",
    name: "ป้อง ท่องโลกกว้าง",
    wish: "ขอให้การเดินทางทั่วโลกปลอดภัย ได้เปิดโลกทัศน์ ได้มิตรภาพใหม่ๆ และได้ถ่ายทอดความงดงามให้ผู้อื่น",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=PongTraveler&hair=short03&skinColor=ecad80",
    style: "rainbow-festival",
    votes: 139,
    createdAt: "2026-11-20T13:00:00.000Z",
    initialPos: { x: -22, z: -8 }
  },
  {
    id: "krathong-17",
    name: "แม่ครัวบัวลอย หวานเจี๊ยบ",
    wish: "ขอให้ร้านขนมไทยขายดิบขายดี ลูกค้าติดอกติดใจ ยิ้มแย้มแจ่มใสมีกำไรเลี้ยงครอบครัว",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=BualoyCook&hair=long02&skinColor=f2d3b1",
    style: "golden-royal",
    votes: 125,
    createdAt: "2026-11-20T13:10:00.000Z",
    initialPos: { x: 8, z: -3 }
  },
  {
    id: "krathong-18",
    name: "ช่างเอก ช่างศิลป์ไทย",
    wish: "ขอสืบสานและอนุรักษ์ศิลปวัฒนธรรมไทยให้คงอยู่สืบไปสู่รุ่นลูกรุ่นหลานอย่างภาคภูมิใจ",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=ChangEk&hair=short04&skinColor=d08b5b",
    style: "classic-banana",
    votes: 118,
    createdAt: "2026-11-20T13:25:00.000Z",
    initialPos: { x: -10, z: -27 }
  },
  {
    id: "krathong-19",
    name: "แอนนา สาวรักสัตว์",
    wish: "ขอให้สัตว์จรจัดทุกตัวมีที่พักพิง มีอาหารกินอิ่ม ปลอดภัยจากภยันตราย และได้รับการรักษาเมื่อเจ็บป่วย",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=AnnaAnimal&hair=long04&skinColor=f2d3b1",
    style: "pink-lotus",
    votes: 104,
    createdAt: "2026-11-20T13:40:00.000Z",
    initialPos: { x: 14, z: -21 }
  },
  {
    id: "krathong-20",
    name: "กวีริมน้ำ วาจางาม",
    wish: "ขอขมาพระแม่วารี ผู้ชโลมชีวีให้ร่มเย็น ดั่งจันทราเพ็ญส่องนภา ขอความสุขสถาพรแด่ทุกดวงใจ",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=PoetWater&hair=short01&skinColor=ecad80",
    style: "cyan-celestial",
    votes: 95,
    createdAt: "2026-11-20T13:55:00.000Z",
    initialPos: { x: -1, z: -11 }
  }
];
