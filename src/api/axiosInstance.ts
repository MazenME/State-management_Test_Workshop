import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001/',
    timeout: 5000,
});



/* 
إعداد Axios instance. ✅
إنشاء API function لجلب المنتجات.✅
بناء نسخة Zustand:✅
products store✅
cart actions
loading/error states✅
بناء واجهة المنتجات والكارت.✅
كتابة اختبارات Zustand بـ Jest. ✅
اختبار الواجهة بـ React Testing Library.
بناء نفس المشروع مرة أخرى باستخدام Redux Toolkit:
store
products slice
cart slice
async thunk
كتابة اختبارات Redux والواجهة.
مقارنة Zustand وRedux Toolkit عمليًا.


*/ 