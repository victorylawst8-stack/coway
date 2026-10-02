import { Category, Product, Banner, SiteSettings } from '../types/database';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 'default-settings',
  site_name: 'COWAY Partner - ร้านค้าตัวแทนจำหน่ายอย่างเป็นทางการ',
  dealer_name: 'COWAY Care & Water Specialist Thailand',
  dealer_code: 'CW-TH-88902',
  phone: '082-456-7890',
  line_url: 'https://line.me/ti/p/~cowaypartner',
  line_id: '@cowaycare.th',
  agent_line_url: 'https://line.me/ti/p/~cowayagent',
  agent_line_id: '@cowayagent.th',
  email: 'contact@cowaycare-thailand.com',
  facebook_url: 'https://facebook.com/cowaycareth',
  instagram_url: 'https://instagram.com/cowaycareth',
  logo_url: '',
  footer_text: 'ดูแลคุณภาพชีวิต ให้ทุกวันเป็นวันที่ดีขึ้น ด้วยนวัตกรรมน้ำดื่มสะอาดและอากาศบริสุทธิ์จาก COWAY การันตีด้วยมาตรฐานระดับโลก',
  dealer_disclaimer: 'เว็บไซต์นี้เป็นเว็บไซต์ของตัวแทนจำหน่ายอิสระที่ได้รับอนุญาต (COWAY Authorized Partner) เพื่อให้ข้อมูลสินค้า บริการสมัครสมาชิก Coway Subscription และบริการหลังการขาย Cody Care ไม่ใช่เว็บไซต์หลักของสำนักงานใหญ่ บมจ. โคเวย์ (ประเทศไทย)',
  working_hours: 'ทุกวัน 08:30 - 20:00 น. (บริการติดตั้งและ Cody ทั่วไทย)',
  announcement: '🎉 โปรโมชั่นพิเศษประจำเดือน: ฟรีค่าติดตั้ง 2,000.- พร้อมฟรีบริการ Cody Care ทำความสะอาดฆ่าเชื้อตลอดสัญญา!'
};

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat-water',
    name: 'เครื่องกรองน้ำ',
    slug: 'water-purifiers',
    description: 'ระบบกรอง RO ละเอียด 0.0001 ไมครอน สะอาด ปลอดภัย พร้อมเลือกอุณหภูมิได้ดั่งใจ',
    icon: 'Droplets',
    image_url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    sort_order: 1,
    status: 'active',
  },
  {
    id: 'cat-air',
    name: 'เครื่องฟอกอากาศ',
    slug: 'air-purifiers',
    description: 'กรองฝุ่น PM2.5 ไวรัส แบคทีเรีย และกลิ่นไม่พึงประสงค์ด้วยไส้กรอง HEPA แท้',
    icon: 'Wind',
    image_url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80',
    sort_order: 2,
    status: 'active',
  },
  {
    id: 'cat-mattress',
    name: 'ที่นอนและเตียง',
    slug: 'mattress-bed',
    description: 'ที่นอน Prime Care พร้อมบริการทำความสะอาดกำจัดไรฝุ่นลึก 7 ขั้นตอนโดย Cody',
    icon: 'BedDouble',
    image_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    sort_order: 3,
    status: 'active',
  },
  {
    id: 'cat-bidet',
    name: 'สุขภัณฑ์และอื่น ๆ',
    slug: 'bidet-lifestyle',
    description: 'ฝารองนั่งอัตโนมัติ และนวัตกรรมเพื่อสุขภาพและความสะอาดในบ้าน',
    icon: 'Sparkles',
    image_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    sort_order: 4,
    status: 'active',
  }
];

export const DEFAULT_BANNERS: Banner[] = [
  {
    id: 'ban-1',
    title: 'ดูแลคุณภาพชีวิต ให้ทุกวันเป็นวันที่ดีขึ้น',
    subtitle: 'สัมผัสประสบการณ์น้ำดื่มสะอาดและอากาศบริสุทธิ์ ด้วยระบบ Coway Subscription เริ่มต้นเพียง 590.-/เดือน พร้อมบริการ Cody ดูแลฟรีตลอดสัญญา',
    image_url: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=1600&q=85',
    button_text: 'ดูสินค้าและโปรโมชั่น',
    button_url: '#products',
    sort_order: 1,
    status: 'active',
    badge: 'COWAY SUBSCRIPTION CARE'
  },
  {
    id: 'ban-2',
    title: 'บริการ Cody Heart Service ดูแลฟรีทุก 2 เดือน',
    subtitle: 'หมดกังวลเรื่องลืมเปลี่ยนไส้กรอง หรือคราบสะสมในถังน้ำ ทีมงานมืออาชีพตรวจเช็คและฆ่าเชื้อด้วยน้ำยาเฉพาะทางฟรีตลอดสัญญา',
    image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=85',
    button_text: 'ดูรายละเอียดบริการ Cody',
    button_url: '#cody-service',
    sort_order: 2,
    status: 'active',
    badge: 'FREE CODY SERVICE'
  }
];

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-villaem-2',
    name: 'COWAY Villaem II (วิลเลี่ยม ทู)',
    slug: 'coway-villaem-2-chp-18ar',
    sku: 'CHP-18AR',
    category_id: 'cat-water',
    short_description: 'เครื่องกรองน้ำไซส์ใหญ่ ถังจุ 11.3 ลิตร ปรับน้ำได้ 4 อุณหภูมิ ร้อน-เย็น-ธรรมดา-อุ่น ตอบโจทย์ครอบครัวใหญ่',
    description: `เครื่องกรองน้ำ COWAY รุ่น Villaem II (CHP-18AR) มาพร้อมดีไซน์เรียบหรูและถังเก็บน้ำขนาดใหญ่พิเศษถึง 11.3 ลิตร ตอบรับการใช้งานของทุกคนในครอบครัวได้อย่างทั่วถึง 

โดดเด่นด้วยระบบกรองน้ำ 6 ขั้นตอน Reverse Osmosis (RO) กรองละเอียดถึง 0.0001 ไมครอน ขจัดอนุภาคขนาดเล็ก โลหะหนัก และเชื้อโรคได้อย่างหมดจด สามารถปรับอุณหภูมิได้ถึง 4 รูปแบบ:
- น้ำร้อน (สำหรับชงกาแฟ ชา บะหมี่กึ่งสำเร็จรูป)
- น้ำอุ่น (เหมาะสำหรับชงนมเด็ก หรือดื่มยามเช้า)
- น้ำอุณหภูมิห้อง (สำหรับดื่มชื่นใจทั่วไป)
- น้ำเย็นสดชื่น (ดับกระหายได้ทันที)

พร้อมระบบเซ็นเซอร์ประหยัดพลังงานอัจฉริยะ (Eco Mode) และระบบล็อกปุ่มน้ำร้อนเพื่อความปลอดภัยของเด็กเล็ก`,
    price: 49900,
    sale_price: 45900,
    monthly_price: 790,
    main_image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    is_featured: true,
    is_promotion: true,
    badge: 'ขายดีอันดับ 1',
    sort_order: 1,
    specifications: {
      'ระบบการกรอง': 'Reverse Osmosis (RO) 6 ขั้นตอน',
      'ความจุถังน้ำ': '11.3 ลิตร (น้ำธรรมดา 6.4L, น้ำเย็น 3.7L, น้ำร้อน 1.2L)',
      'อัตราการกรอง': '7.9 ลิตร / ชั่วโมง',
      'อุณหภูมิน้ำ': '4 อุณหภูมิ (ร้อน / เย็น / อุณหภูมิห้อง / อุ่น)',
      'ขนาด (กว้าง x ลึก x สูง)': '340 x 523 x 518.7 มม.',
      'น้ำหนัก': '20.2 กก.',
      'การใช้ไฟฟ้า': 'น้ำร้อน 270W - 320W / น้ำเย็น 0.7A'
    },
    highlights: [
      'ถังน้ำขนาดใหญ่พิเศษ 11.3 ลิตร เหมาะสำหรับครอบครัว 4-8 คน',
      'มีน้ำอุ่นพิเศษ ปรับอุณหภูมิได้ง่ายเพียงหมุนปุ่ม',
      'ระบบล็อกป้องกันเด็กสัมผัสน้ำร้อน (Child Safety Lock)',
      'ฟรีบริการ Cody ทำความสะอาดฆ่าเชื้อทุก 2 เดือน',
      'ฟรีบริการเปลี่ยนไส้กรองแท้ทุก 4 เดือนตลอดสัญญา'
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-neo-plus',
    name: 'COWAY Neo Plus (นีโอ พลัส)',
    slug: 'coway-neo-plus-chp-264l',
    sku: 'CHP-264L',
    category_id: 'cat-water',
    short_description: 'รุ่นยอดนิยมอันดับ 1 คุ้มค่าที่สุด ถัง 5.8 ลิตร ร้อน-เย็น-ธรรมดา ดีไซน์กะทัดรัดลงตัวทุกมุมครัว',
    description: `COWAY Neo Plus (CHP-264L) เครื่องกรองน้ำยอดฮิตที่ทุกบ้านไว้วางใจ ดีไซน์โมเดิร์น สวยงาม กะทัดรัด เหมาะกับครอบครัวขนาด 2-4 คน หรือคอนโดมิเนียม

จ่ายน้ำได้ 3 อุณหภูมิ (น้ำร้อน น้ำเย็น และน้ำอุณหภูมิปกติ) คันโยกใช้งานง่าย พร้อมฟังก์ชันกดน้ำต่อเนื่อง มีโหมดประหยัดพลังงาน Eco Sensor ช่วยลดการใช้ไฟเมื่อห้องมืด ไส้กรองระบบ RO มาตรฐานระดับโลก สะอาด ปลอดภัย ดื่มได้อย่างมั่นใจทุกแก้ว`,
    price: 39900,
    sale_price: 36900,
    monthly_price: 690,
    main_image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    is_featured: true,
    is_promotion: true,
    badge: 'สินค้ายอดนิยม',
    sort_order: 2,
    specifications: {
      'ระบบการกรอง': 'Reverse Osmosis (RO)',
      'ความจุถังน้ำ': '5.8 ลิตร (น้ำธรรมดา 2.5L, น้ำเย็น 2.3L, น้ำร้อน 1.0L)',
      'อุณหภูมิน้ำ': '3 อุณหภูมิ (ร้อน / เย็น / อุณหภูมิห้อง)',
      'ขนาด (กว้าง x ลึก x สูง)': '260 x 505 x 500 มม.',
      'น้ำหนัก': '18 กก.',
      'ระบบประหยัดพลังงาน': 'Eco Sensor อัจฉริยะ'
    },
    highlights: [
      'รุ่นยอดนิยม ดีไซน์เรียบสวย ไม่เปลืองพื้นที่',
      'คันโยกกดน้ำง่าย พร้อมระบบกดน้ำต่อเนื่องไม่ต้องกดค้าง',
      'เซ็นเซอร์ตรวจจับความสว่างเพื่อปรับเข้าสู่โหมดประหยัดไฟยามค่ำคืน',
      'ฟรีบริการทำความสะอาดทุก 2 เดือน และเปลี่ยนไส้กรองทุก 4 เดือน'
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-my-ice',
    name: 'COWAY My Ice (มาย ไอซ์)',
    slug: 'coway-my-ice-chpi-7520l',
    sku: 'CHPI-7520L',
    category_id: 'cat-water',
    short_description: 'เครื่องกรองน้ำทำน้ำแข็งในตัว นวัตกรรมใหม่ล่าสุด น้ำร้อน-เย็น-ธรรมดา-น้ำแข็งสะอาดบริสุทธิ์',
    description: `ครั้งแรกของเครื่องกรองน้ำและเครื่องทำน้ำแข็งในเครื่องเดียว COWAY My Ice (CHPI-7520L) นวัตกรรมระดับพรีเมียมที่ทำให้ชีวิตคุณสะดวกสบายขึ้นอย่างไม่เคยมีมาก่อน

ผลิตน้ำแข็งสะอาด ใส ไร้กลิ่น ด้วยระบบกรอง RO พร้อมระบบฆ่าเชื้อ UV Sterilization ในช่องทำน้ำแข็งและหัวจ่ายน้ำอัตโนมัติทุกวัน เลือกขนาดก้อนน้ำแข็งได้ จ่ายน้ำได้ 3 อุณหภูมิ หน้าจอสัมผัสสวยหรูทันสมัย`,
    price: 65900,
    sale_price: 59900,
    monthly_price: 1090,
    main_image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    is_featured: true,
    is_promotion: true,
    badge: 'รุ่นใหม่ล่าสุด',
    sort_order: 3,
    specifications: {
      'ระบบการกรอง': 'Reverse Osmosis (RO) + UV Sterilization',
      'ฟังก์ชันพิเศษ': 'ทำน้ำแข็งสะอาดในตัว (Ice Maker)',
      'ความจุถังน้ำ': '5.1 ลิตร + ถังน้ำแข็ง 1.0 กก.',
      'การผลิตน้ำแข็ง': 'ผลิตได้สูงสุด 5.6 กก. / วัน',
      'ระบบฆ่าเชื้อ': 'Dual UV Sterilization ในช่องน้ำแข็งและหัวจ่ายน้ำ'
    },
    highlights: [
      'มีเครื่องทำน้ำแข็งสะอาดเกรดพรีเมียมในตัว ไร้กลิ่นตู้เย็นกวนใจ',
      'ระบบ Dual UV ฆ่าเชื้อหัวจ่ายและช่องน้ำแข็งอัตโนมัติ',
      'หน้าจอ Touch Screen ดีไซน์พรีเมียมสไตล์โมเดิร์นลักชัวรี',
      'ฟรีบริการทำความสะอาด Cody ทุก 2 เดือน และไส้กรองทุก 4 เดือน'
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-cinnamon',
    name: 'COWAY Cinnamon (ซินนามอน)',
    slug: 'coway-cinnamon-p-6320l',
    sku: 'P-6320L',
    category_id: 'cat-water',
    short_description: 'เครื่องกรองน้ำอุณหภูมิห้อง ดีไซน์มินิมอล บางเพียง 20 ซม. ไม่ต้องใช้ไฟฟ้า ผ่อนสบายสุด',
    description: `COWAY Cinnamon (P-6320L) เครื่องกรองน้ำระบบ RO น้ำอุณหภูมิห้อง ดีไซน์มินิมอล เพรียวบางเพียง 20 ซม. ประหยัดพื้นที่จัดวาง 

ไม่ต้องเสียบปลั๊กไฟ ใช้งานง่ายด้วยปุ่มหมุนต่อเนื่องหรือกดแก้ว ถังน้ำขนาด 5.0 ลิตร เหมาะสำหรับคอนโดมิเนียมหรือผู้ที่ชื่นชอบดื่มน้ำอุณหภูมิห้องเพื่อสุขภาพ ราคาเบา สบายกระเป๋า`,
    price: 29900,
    sale_price: 26900,
    monthly_price: 490,
    main_image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    is_featured: false,
    is_promotion: true,
    badge: 'ราคาประหยัดสุด',
    sort_order: 4,
    specifications: {
      'ระบบการกรอง': 'RO Membrane 6 ขั้นตอน',
      'ความจุถังน้ำ': '5.0 ลิตร (น้ำอุณหภูมิห้อง)',
      'ระบบการทำงาน': 'Non-Electric ไม่ต้องใช้ไฟฟ้า',
      'ขนาด (กว้าง x ลึก x สูง)': '200 x 400 x 405 มม.',
      'น้ำหนัก': '6.5 กก.'
    },
    highlights: [
      'ไม่ต้องใช้ไฟฟ้า ปลอดภัย 100% ประหยัดค่าไฟ',
      'ดีไซน์เพรียวบางเพียง 20 เซนติเมตร วางบนเคาน์เตอร์ได้อย่างลงตัว',
      'ค่าบริการรายเดือนเริ่มต้นสบายกระเป๋าเพียง 490 บาท/เดือน',
      'ฟรีเปลี่ยนไส้กรองทุก 4 เดือนและล้างถังทุก 2 เดือน'
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-storm',
    name: 'COWAY Storm (สตอร์ม)',
    slug: 'coway-storm-ap-1516d',
    sku: 'AP-1516D',
    category_id: 'cat-air',
    short_description: 'เครื่องฟอกอากาศทรงพลัง ลมหมุนเวียน 3 ทิศทาง ฟอกเร็วครอบคลุม 50 ตร.ม. พร้อมไส้กรอง HEPA แท้',
    description: `COWAY Storm (AP-1516D) เครื่องฟอกอากาศประสิทธิภาพสูงที่ผสานการหมุนเวียนอากาศแบบ Circulation เข้ากับการกรองฝุ่นระดับไมครอน

กระจายลมได้ไกลถึง 6 เมตร ด้วยทิศทางลม 3 รูปแบบ ดักจับฝุ่นละอองขนาดเล็ก PM2.5 ควัน เกสรดอกไม้ และเชื้อโรคได้อย่างรวดเร็ว มีไฟวงแหวนแสดงสถานะคุณภาพอากาศแบบเรียลไทม์ 4 สี เหมาะกับห้องนั่งเล่น ห้องนอนใหญ่ หรือออฟฟิศ`,
    price: 34900,
    sale_price: 31900,
    monthly_price: 690,
    main_image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    is_featured: true,
    is_promotion: true,
    badge: 'ฟอกอากาศยอดนิยม',
    sort_order: 5,
    specifications: {
      'พื้นที่ห้องที่เหมาะสม': 'สูงสุด 50 ตารางเมตร',
      'ระบบการกรอง': '4 ขั้นตอน (Pre-filter, Fine Dust, Deodorization, HEPA Filter)',
      'ทิศทางลม': '3 ทิศทาง (ลมกระจายหน้า, ลมพุ่งตรง, ลมกระจายบน)',
      'เซ็นเซอร์วัดคุณภาพ': 'Dust Sensor & Light Sensor',
      'ไฟบอกคุณภาพอากาศ': '4 สี (ฟ้า-เขียว-เหลือง-แดง)'
    },
    highlights: [
      'พัดลมทรงพลัง ส่งลมสะอาดไกลถึง 6 เมตร',
      'ไส้กรอง HEPA ดักจับ PM2.5 ไวรัส แบคทีเรีย 99.99%',
      'โหมด Haze Mode กำจัดควันและฝุ่นหนาแน่นได้เร็วทันใจ',
      'ทีม Cody เข้าทำความสะอาดและเปลี่ยนแผ่นกรองฟรีตลอดสัญญา'
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-noble-air',
    name: 'COWAY Noble Air (โนเบิล)',
    slug: 'coway-noble-ap-2021a',
    sku: 'AP-2021A',
    category_id: 'cat-air',
    short_description: 'ดีไซน์สถาปัตยกรรมระดับ Masterpiece กรอง 360 องศา ไส้กรอง 4D Double HEPA ครอบคลุม 66 ตร.ม.',
    description: `สัมผัสที่สุดของนวัตกรรมและดีไซน์เหนือระดับกับ COWAY Noble (AP-2021A) ดีไซน์สไตล์มินิมอลลิสต์ทรงทาวเวอร์ การันตีด้วยรางวัลด้านการออกแบบระดับโลก iF Design และ Red Dot

ฟอกอากาศรอบทิศทาง 360 องศา ด้วยเทคโนโลยี 4D Double HEPA Filter พร้อมระบบฆ่าเชื้อด้วยรังสี UVC อัจฉริยะ ปรับทิศทางลมได้ตามต้องการ แสดงค่า PM2.5, PM1.0 และความชื้นแบบดิจิทัลแบบแม่นยำ`,
    price: 49900,
    sale_price: 44900,
    monthly_price: 990,
    main_image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    is_featured: true,
    is_promotion: false,
    badge: 'ดีไซน์พรีเมียม',
    sort_order: 6,
    specifications: {
      'พื้นที่ห้องที่เหมาะสม': 'สูงสุด 66 ตารางเมตร',
      'ระบบการกรอง': '4D Double HEPA + UVC Sterilization',
      'เซ็นเซอร์': 'PM1.0, PM2.5, Gas Sensor, Light Sensor',
      'หน้าจอ': 'Hidden LED Display & Digital Air Quality Index',
      'ขนาด (กว้าง x ลึก x สูง)': '320 x 320 x 805 มม.'
    },
    highlights: [
      'ดีไซน์ระดับ Masterpiece สวยงามเข้ากับเฟอร์นิเจอร์บ้านหรู',
      'กรองอากาศรอบทิศทาง 360 องศา และตรวจวัดฝุ่นเล็กระดับ PM1.0',
      'ระบบ UVC ฆ่าเชื้อไวรัสในอากาศอย่างมีประสิทธิภาพ',
      'บริการ Cody ตรวจเช็คทำความสะอาดแผ่นกรองฟรีถึงบ้าน'
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-prime-mattress',
    name: 'COWAY Prime Series Mattress (ที่นอนไพร์ม)',
    slug: 'coway-prime-series-mattress',
    sku: 'MAT-PRIME-6F',
    category_id: 'cat-mattress',
    short_description: 'ที่นอนพ็อกเก็ตสปริง 5-Zone พร้อม Topper เปลี่ยนใหม่ได้ และบริการ Cody Home Care กำจัดไรฝุ่นฟรี',
    description: `ยกระดับการนอนหลับให้มีคุณภาพสูงสุดกับ COWAY Prime Series Mattress ที่นอนที่คิดค้นตามหลักสรีรศาสตร์ พร้อมระบบการดูแลสุขอนามัยแบบสมาชิก

โครงสร้างพ็อกเก็ตสปริงอิสระ 5 โซน รองรับน้ำหนักร่างกายได้อย่างสมดุล ลดแรงสั่นสะเทือนเมื่อคนข้างๆ พลิกตัว ชั้นโฟมความหนาแน่นสูงและเมมโมรีโฟมระบายอากาศได้ดีเยี่ยม พร้อมท็อปเปอร์ที่สามารถถอดเปลี่ยนได้ 

จุดเด่นที่สุดคือบริการ "Cody Home Care" ทีมงานจะเข้ามาทำความสะอาด ดูดไรฝุ่นลึก และฆ่าเชื้อที่นอนด้วยเครื่องมือนำเข้ามาตรฐานสากล 7 ขั้นตอนฟรีทุก 4 เดือน!`,
    price: 52900,
    sale_price: 48900,
    monthly_price: 1190,
    main_image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    is_featured: false,
    is_promotion: true,
    badge: 'สุขภาพการนอน',
    sort_order: 7,
    specifications: {
      'ขนาด': 'King Size 6 ฟุต / Queen Size 5 ฟุต',
      'ระบบรองรับ': '5-Zone Pocket Springs แยกอิสระ',
      'ชั้นวัสดุ': 'High-Density Memory Foam & Anti-Microbial Fabric',
      'บริการ Home Care': 'ทำความสะอาดกำจัดไรฝุ่น 7 ขั้นตอนฟรีทุก 4 เดือน',
      'การเปลี่ยน Topper': 'ฟรีบริการเปลี่ยนท็อปเปอร์ใหม่ตามเงื่อนไขสัญญา'
    },
    highlights: [
      'ที่นอนพ็อกเก็ตสปริง 5 โซน รองรับสรีระกระดูกสันหลังอย่างถูกต้อง',
      'บริการทำความสะอาดกำจัดไรฝุ่น 7 ขั้นตอนฟรีถึงบ้านทุก 4 เดือน',
      'สามารถเลือกความนุ่มหรือแน่น (Soft / Firm) ได้ตามความชอบ',
      'สมัครสมาชิกรายเดือน ผ่อนสบาย ไม่ต้องจ่ายเงินก้อน'
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const CODY_SERVICE_STEPS = [
  {
    step: '01',
    title: 'นัดหมายตรงเวลา',
    desc: 'เจ้าหน้าที่ Cody ประจำพื้นที่โทรนัดหมายวันและเวลาที่ท่านสะดวก เข้าบริการทุก 2 เดือนอย่างสม่ำเสมอ'
  },
  {
    step: '02',
    title: 'ตรวจเช็ค 10 รายการ',
    desc: 'ตรวจวัดแรงดันน้ำ ตรวจสอบระบบไฟฟ้า และเช็คความสะอาดของชิ้นส่วนทั้งภายนอกและภายในเครื่อง'
  },
  {
    step: '03',
    title: 'ทำความสะอาด & ฆ่าเชื้อ',
    desc: 'ล้างถังเก็บน้ำและหัวจ่ายด้วยระบบน้ำยาฆ่าเชื้อเฉพาะทางของ COWAY ปราศจากสารเคมีตกค้าง'
  },
  {
    step: '04',
    title: 'เปลี่ยนไส้กรองแท้ฟรี',
    desc: 'เปลี่ยนไส้กรองแท้ตามระยะเวลาที่กำหนดทุก 4 เดือน โดยไม่มีค่าใช้จ่ายเพิ่มเติมใด ๆ'
  }
];

export const FREQUENTLY_ASKED_QUESTIONS = [
  {
    q: 'ระบบ Coway Subscription คืออะไร แตกต่างจากการซื้อขาดยังไง?',
    a: 'Coway Subscription คือระบบสมัครสมาชิกดูแลสุขอนามัยแบบรายเดือน โดยลูกค้าจะได้รับเครื่องใหม่ไปติดตั้งที่บ้าน พร้อมทีมงาน "Cody" เข้าดูแลล้างทำความสะอาดถังน้ำทุก 2 เดือน และเปลี่ยนไส้กรองแท้ทุก 4 เดือนฟรีตลอดสัญญา โดยไม่มีค่าบริการหรือค่าอะไหล่แอบแฝงใดๆ เลย เหมาะสำหรับท่านที่ไม่ต้องการกังวลเรื่องการหาซื้อไส้กรองหรือลืมเปลี่ยนไส้กรอง'
  },
  {
    q: 'ต้องใช้เอกสารอะไรบ้างในการสมัคร และมีเงื่อนไขอย่างไร?',
    a: 'การสมัครทำได้ง่ายมาก ใช้เพียงบัตรประชาชนใบเดียวสำหรับคนไทย สามารถเลือกชำระค่าบริการรายเดือนผ่านการตัดบัตรเครดิต หรือหักผ่านบัญชีธนาคาร (Direct Debit) ได้ตามความสะดวก อนุมัติไว ไม่ต้องมีคนค้ำประกัน'
  },
  {
    q: 'มีค่าติดตั้งหรือค่าบริการแรกเข้าหรือไม่?',
    a: 'ทางร้านตัวแทนจำหน่ายมีโปรโมชั่นพิเศษ "ฟรีค่าติดตั้ง 2,000 บาท" และฟรีค่าลงทะเบียนแรกเข้า พร้อมบริการจัดส่งและติดตั้งโดยช่างผู้เชี่ยวชาญของ COWAY ทั่วประเทศไทย'
  },
  {
    q: 'ถ้าเครื่องมีปัญหา น้ำไม่ไหล หรือมีข้อสงสัย ต้องทำอย่างไร?',
    a: 'สามารถติดต่อผ่านร้านตัวแทนจำหน่ายของเราทาง LINE หรือเบอร์โทรศัพท์ได้ทันที หรือโทรเข้า Call Center ของ COWAY ทีมช่างและ Cody พร้อมเข้าดูแลแก้ไขปัญหาให้ถึงที่บ้านฟรีตลอดอายุสัญญา'
  },
  {
    q: 'สามารถย้ายจุดติดตั้งเมื่อย้ายบ้านหรือย้ายคอนโดได้ไหม?',
    a: 'สามารถทำได้ครับ สมาชิก COWAY มีสิทธิ์ขอรับบริการรื้อถอนและติดตั้งใหม่ไปยังที่อยู่ใหม่ได้ทั่วประเทศไทย โดยแจ้งล่วงหน้าผ่านทาง LINE หรือฝ่ายบริการลูกค้า'
  }
];
