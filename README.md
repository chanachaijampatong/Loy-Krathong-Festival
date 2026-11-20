# 🪷 ประเพณีลอยกระทงออนไลน์ 3D (Loy Krathong Festival 3D Web App)

เว็บแอปพลิเคชันจำลองบรรยากาศงานประเพณีลอยกระทงแบบ 3D สมจริง พร้อมระบบประกวดกระทง ถ่ายภาพ และโหวตขวัญใจมหาชนแบบ Real-time ด้วย Three.js, React, Tailwind CSS และ Google Cloud Firestore

![Loy Krathong Preview](src/assets/avatar-placeholder.svg)

---

## ✨ ไฮไลท์และฟีเจอร์เด่น (Key Features)

1. **3D WebGL World (Three.js)**:
   - **พระอุโบสถวัดไทย**: หลังคาซ้อน 3 ชั้นสีชาด ช่อฟ้า ใบระกา และหน้าบันลายทอง
   - **พระเจดีย์ทรงระฆังสีทองอร่าม**: ฉัตรทองคำและแสงเรืองรองสะท้อนผิวน้ำ
   - **เรือนไทยประยุกต์ 2 ชั้น**: เรือนแฝดสองจั่ว บันไดนอกชาน และโอ่งลายครามโบราณ
   - **สายน้ำและแสงจันทร์**: ผิวน้ำริ้วคลื่นระยิบระยับด้วย Procedural Normal Map และพระจันทร์เต็มดวง
   - **โคมลอย & หิ่งห้อย**: โคมลอย 10 ลำลอยล่องตามสายลม และหิ่งห้อย 35 จุดเหนือผิวน้ำ
   - **ผู้คนและบรรยากาศ**: นักท่องเที่ยว 20 คนในชุดไทยหลากสีสัน

2. **ระบบประกวดและสร้างกระทง**:
   - เลือกดีไซน์กระทง 5 แบบ (กระทงใบตองดั้งเดิม, กระทงบัวชมพู, กระทงทองคำหลวง, กระทงฟ้านภาลัย, กระทงสายรุ้ง)
   - ถ่ายภาพเซลฟี่ผ่านกล้องเว็บแคม หรืออัปโหลดรูปภาพ
   - ระบบบีบอัดภาพอัตโนมัติ $\le 500$ KB ก่อนส่งขึ้น Cloud Firestore

3. **ระบบคะแนนโหวต & อันดับ (Real-time Leaderboard)**:
   - โหวตให้คะแนนกระทงที่ลอยในแม่น้ำแบบเรียลไทม์
   - หมุนมุมมองรอบทิศทาง 360° ซูมเข้า-ออก และคลิกกระทงเพื่อเปิดการ์ดแสดงคำอธิษฐาน

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend Framework:** React 19 + Vite
- **3D Graphics & Physics:** Three.js + OrbitControls
- **Styling:** Tailwind CSS + Lucide Icons + Canvas Effects
- **Cloud Database:** Firebase Cloud Firestore (Real-time synchronization)
- **Audio:** Web Audio API (Chimes & River Sound synthesis)

---

## 🚀 วิธีการติดตั้งและรันในเครื่อง (Getting Started)

1. **Clone Repository:**
   ```bash
   git clone https://github.com/chanachaijampatong/Loy-Krathong-Festival.git
   cd Loy-Krathong-Festival
   ```

2. **ติดตั้ง Dependencies:**
   ```bash
   npm install
   ```

3. **ตั้งค่าไฟล์สภาพแวดล้อม (`.env`):**
   คัดลอกไฟล์ `.env.example` เป็น `.env` แล้วระบุค่า Firebase Configuration ของคุณ
   ```bash
   cp .env.example .env
   ```

4. **รันเซิร์ฟเวอร์ทดสอบ (Development Mode):**
   ```bash
   npm run dev
   ```
   เปิดเบราว์เซอร์ไปที่ `http://localhost:5173`

5. **บิลด์สำหรับ Production:**
   ```bash
   npm run build
   ```

---

## 📄 ใบอนุญาต (License)
Distributed under the MIT License.
