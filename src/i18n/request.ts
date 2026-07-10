import { getRequestConfig } from 'next-intl/server'

const messages = {
  common: {
    actions: {
      next: 'ถัดไป',
      previous: 'ย้อนกลับ',
    },
    options: {},
    sidebar: {
      terms_and_policy: {
        modal_subtitle: 'รายละเอียดข้อกำหนด นโยบาย และการคุ้มครองข้อมูล',
        modal_title: 'ข้อกำหนดและนโยบาย',
        policy_content_1:
          'ระบบนี้ใช้สำหรับติดตามและวิเคราะห์ข้อมูลหม้อแปลงในขอบเขตงานที่ได้รับอนุญาต',
        policy_content_2:
          'ผู้ใช้งานควรตรวจสอบความถูกต้องของข้อมูลก่อนนำไปใช้ประกอบการตัดสินใจภาคสนาม',
        policy_content_3:
          'การใช้งานระบบควรเป็นไปตามแนวทางและมาตรฐานของหน่วยงาน',
        policy_section: 'นโยบายการใช้งาน',
        privacy_content_1:
          'ระบบจัดเก็บและประมวลผลข้อมูลเท่าที่จำเป็นต่อการให้บริการ',
        privacy_content_2:
          'ข้อมูลที่เกี่ยวข้องกับการปฏิบัติงานควรถูกใช้งานโดยผู้มีสิทธิ์เท่านั้น',
        privacy_content_3:
          'โปรดหลีกเลี่ยงการเผยแพร่ข้อมูลภายในออกนอกระบบโดยไม่ได้รับอนุญาต',
        privacy_section: 'การคุ้มครองข้อมูล',
        subtitle: 'ข้อกำหนดการใช้งาน',
        terms_content_1:
          'ผู้ใช้งานต้องใช้ระบบตามวัตถุประสงค์ของการติดตามและบริหารจัดการข้อมูลหม้อแปลง',
        terms_content_2:
          'ห้ามแก้ไข ดัดแปลง หรือเผยแพร่ข้อมูลโดยไม่ได้รับอนุญาต',
        terms_content_3:
          'การดำเนินการใด ๆ ในระบบอาจถูกบันทึกเพื่อความปลอดภัยและการตรวจสอบย้อนหลัง',
        terms_section: 'ข้อกำหนดการใช้งาน',
        title: 'ข้อกำหนดและนโยบาย',
      },
    },
    system: {
      fetching_error: 'ไม่สามารถดึงข้อมูลได้',
      latest_data_date: 'ข้อมูลล่าสุด',
    },
    table: {
      filters: {
        no_data: 'ไม่พบข้อมูล',
        reset: 'ล้างตัวกรอง',
        search: 'ค้นหา',
        selected: 'รายการที่เลือก',
      },
      loading: 'กำลังโหลดข้อมูล...',
      month: 'เดือน',
      no_data: 'ไม่พบข้อมูล',
      no_data_description: 'ลองปรับตัวกรองหรือค้นหาด้วยคำอื่น',
      number: '#',
      pagination: {
        items: 'รายการ',
        of: 'จาก',
        page: 'หน้า',
        rows_per_page: 'แสดงต่อหน้า',
      },
      updating: 'กำลังอัปเดตข้อมูล...',
      year: 'ปี',
    },
  },
}

export default getRequestConfig(async () => {
  // Default locale for the meter dashboard
  const locale = 'th'

  return {
    locale,
    messages,
  }
})
