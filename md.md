# قائمة المهام المحدثة

## أهداف المشروع

هنشتغل على مشروع عملي باستخدام React.

هنطبق فيه المفاهيم والأدوات التالية:

* Zustand لإدارة الـ state.
* Jest لكتابة وتشغيل الاختبارات.
* React Testing Library لاختبار مكونات React وسلوك المستخدم.
* Axios للتعامل مع الـ API.
* JSON Server كـ mock backend.
* بناء مشروع للمنتجات والكارت.
* كتابة اختبارات للـ store والـ logic.
* كتابة اختبارات للـ components والـ UI.

---

# 1. الـ State

الـ state هي البيانات التي تتغير أثناء تشغيل التطبيق.

مثال:

```js
const [count, setCount] = useState(0)
```

هنا `count` هي الـ state.

في مشروعنا يمكن أن تكون الـ state بالشكل التالي:

```js
{
  products: [],
  cart: [],
  isLoading: false,
  error: null
}
```

هذه البيانات تحتاجها أكثر من component.

بدل ما نمررها باستخدام props من component إلى آخر، سنضعها داخل Zustand store.

---

# 2. Zustand

## ما هو Zustand؟

Zustand هي مكتبة بسيطة لإدارة الـ state في React.

الفكرة الأساسية:

* ننشئ store.
* نضع فيه البيانات والـ actions التي تغيرها.
* كل component يأخذ الجزء الذي يحتاجه فقط.
* لا نحتاج إلى Provider.
* لا نحتاج إلى reducers أو كمية كبيرة من الـ boilerplate.

مثال:

```jsx
import { create } from 'zustand'

const useCounterStore = create((set) => ({
  count: 0,

  increase: () => {
    set((state) => ({
      count: state.count + 1,
    }))
  },

  reset: () => {
    set({
      count: 0,
    })
  },
}))
```

نستخدم الـ store داخل component:

```jsx
function Counter() {
  const count = useCounterStore((state) => state.count)
  const increase = useCounterStore((state) => state.increase)

  return (
    <div>
      <p>{count}</p>
      <button onClick={increase}>Increase</button>
    </div>
  )
}
```

---

## الـ Selectors

هذا:

```js
useCounterStore((state) => state.count)
```

يسمى Selector.

معناه أننا نطلب count فقط من الـ store.

بدل:

```js
const store = useCounterStore()
```

نستخدم:

```js
const count = useCounterStore((state) => state.count)
```

بهذه الطريقة، الـ component يهتم فقط بالـ state التي يحتاجها.

---

## استخدام set

الـ set تستخدم لتحديث الـ state.

مثال:

```js
set({
  count: 10,
})
```

أو عندما تعتمد القيمة الجديدة على القيمة القديمة:

```js
set((state) => ({
  count: state.count + 1,
}))
```

الطريقة الثانية مهمة عندما تعتمد القيمة الجديدة على القيمة الحالية.

---

## تحديث الـ State بطريقة صحيحة

لا نقوم بتعديل الـ state مباشرة.

خطأ:

```js
state.items.push(product)
```

الأفضل:

```js
set((state) => ({
  items: [...state.items, product],
}))
```

هنا نقوم بإنشاء array جديدة بدل تعديل الـ array القديمة مباشرة.

---

# 3. استخدام Zustand مع العمليات غير المتزامنة

Zustand يمكنه التعامل مع async actions بشكل طبيعي.

مثال:

```js
const useProductStore = create((set) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({
      isLoading: true,
      error: null,
    })

    try {
      const response = await api.get('/products')

      set({
        products: response.data,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: 'Failed to fetch products',
        isLoading: false,
      })
    }
  },
}))
```

---

# 4. Axios

سنضع Axios في ملف مستقل حتى لا نكرر الـ base URL في كل مكان.

```js
import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 5000,
})
```

بعد ذلك يمكننا استخدام:

```js
api.get('/products')
```

وهذا سيطلب:

```text
http://localhost:3001/products
```

وبذلك لا نحتاج إلى تكرار الـ base URL في كل request.

---

# 5. الـ Store الخاص بالمشروع

الـ store المتوقع سيكون تقريبًا بالشكل التالي:

```js
const useStore = create((set) => ({
  products: [],
  cart: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    // Fetch products
  },

  addToCart: (product) => {
    // Add product to cart
  },

  removeFromCart: (productId) => {
    // Remove product from cart
  },

  clearCart: () => {
    // Clear cart
  },
}))
```

مثال على المنتج:

```js
{
  id: 1,
  title: 'Keyboard',
  price: 100,
  stock: 5
}
```

مثال على عنصر داخل الكارت:

```js
{
  id: 1,
  title: 'Keyboard',
  price: 100,
  quantity: 2
}
```

## قواعد المشروع

المهم في منطق المشروع:

* المخزون لا ينزل تحت `0`.
* الـ quantity لا تتجاوز الـ stock.
* لا يمكن إضافة منتج انتهى مخزونه.

---

# 6. Jest

## ما هو Jest؟

Jest هو test runner.

مسؤول عن:

* البحث عن ملفات الاختبار.
* تشغيل الاختبارات.
* عرض نتيجة الاختبار.
* توفير expect.
* توفير mocks.
* توفير describe.
* توفير test.
* توفير beforeEach.

مثال:

```js
function sum(firstNumber, secondNumber) {
  return firstNumber + secondNumber
}

test('adds two numbers', () => {
  expect(sum(2, 3)).toBe(5)
})
```

هنا:

```js
test(...)
```

يعرّف الاختبار.

```js
expect(...)
```

يحدد القيمة التي نختبرها.

```js
toBe(...)
```

يحدد النتيجة المتوقعة.

---

# 7. أشهر Matchers في Jest

مقارنة قيمة بسيطة:

```js
expect(value).toBe(5)
```

مقارنة عميقة للـ objects:

```js
expect(object).toEqual({
  name: 'Keyboard',
  price: 100,
})
```

اختبار طول الـ array:

```js
expect(array).toHaveLength(3)
```

اختبار وجود عنصر داخل الـ array:

```js
expect(array).toContain(product)
```

اختبارات القيم:

```js
expect(value).toBeTruthy()
expect(value).toBeFalsy()
expect(value).toBeNull()
expect(value).toBeDefined()
```

اختبار أن function ترمي error:

```js
expect(() => riskyFunction()).toThrow()
```

---

## اختبار العمليات غير المتزامنة

يمكننا استخدام:

```js
await expect(fetchUsers()).resolves.toEqual([
  { id: 1, name: 'Ali' },
])
```

أو عند حدوث error:

```js
await expect(fetchUsers()).rejects.toThrow()
```

---

# 8. describe و beforeEach

مثال:

```js
describe('cart logic', () => {
  beforeEach(() => {
    // Reset state before each test
  })

  test('adds product to cart', () => {
    // test
  })

  test('removes product from cart', () => {
    // test
  })
})
```

describe تستخدم لتجميع مجموعة من الاختبارات المرتبطة ببعض.

beforeEach يعمل قبل كل test.

الهدف هو منع test من التأثير على test آخر.

---

# 9. Jest Mocks

## ما هو Mock؟

الـ mock هو نسخة مزيفة من function أو module.

نستخدم الـ mocks حتى لا تعتمد الاختبارات على:

* الإنترنت.
* تشغيل JSON Server.
* سرعة الشبكة.
* بيانات خارجية.

مثال:

```js
const callback = jest.fn()

callback('hello')

expect(callback).toHaveBeenCalled()

expect(callback).toHaveBeenCalledWith('hello')

expect(callback).toHaveBeenCalledTimes(1)
```

---

## Mock Return Value

```js
const getUser = jest.fn()

getUser.mockReturnValue({
  id: 1,
  name: 'Ali',
})

expect(getUser()).toEqual({
  id: 1,
  name: 'Ali',
})
```

---

## Mock Promise

عندما نريد أن يرجع الـ mock نتيجة ناجحة:

```js
const fetchProducts = jest.fn()

fetchProducts.mockResolvedValue([
  { id: 1, title: 'Keyboard' },
])
```

وعند اختبار error:

```js
fetchProducts.mockRejectedValue(
  new Error('Network error')
)
```

---

# 10. Mocking Axios

لو عندنا function تتعامل مع الـ API:

```js
import axios from 'axios'

export async function getProducts() {
  const response = await axios.get('/products')

  return response.data
}
```

نستطيع اختبارها بدون API حقيقي:

```js
import axios from 'axios'
import { getProducts } from './productsApi'

jest.mock('axios')

test('returns products from API', async () => {
  const products = [
    { id: 1, title: 'Keyboard' },
  ]

  axios.get.mockResolvedValue({
    data: products,
  })

  const result = await getProducts()

  expect(result).toEqual(products)

  expect(axios.get).toHaveBeenCalledWith('/products')
})
```

لكن عندما نستخدم Axios instance:

```js
import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3001',
})
```

سنحدد طريقة الـ mocking حسب تنظيم المشروع.

سنطبقها أثناء بناء المشروع بطريقة واضحة.

---

# 11. React Testing Library

## ما هي React Testing Library؟

React Testing Library ليست test runner.

هي مجموعة أدوات تساعدنا على:

* تشغيل component داخل DOM وهمي.
* البحث عن العناصر.
* التفاعل مع العناصر.
* الضغط على الأزرار.
* كتابة النصوص.
* التأكد مما يراه المستخدم.

العلاقة بين Jest و React Testing Library:

```text
Jest
    ↓
Runs the tests
Provides expect
Provides mocks

React Testing Library
    ↓
Renders React components
Queries the DOM
Interacts with the UI
```

React Testing Library يمكن استخدامها مع Jest أو Vitest أو غيرهما.

---

# 12. أول اختبار لمكون React

## الـ Component

```jsx
function Greeting() {
  return <h1>Hello, Ali</h1>
}
```

## الـ Test

```jsx
import { render, screen } from '@testing-library/react'
import Greeting from './Greeting'

test('shows greeting', () => {
  render(<Greeting />)

  expect(
    screen.getByRole('heading', {
      name: 'Hello, Ali',
    }),
  ).toBeInTheDocument()
})
```

هنا:

```js
render(<Greeting />)
```

يشغل الـ component داخل DOM وهمي.

```js
screen.getByRole(...)
```

يبحث عن العنصر بطريقة قريبة من طريقة تعامل المستخدم مع الصفحة.

```js
toBeInTheDocument()
```

يتأكد أن العنصر موجود داخل الـ DOM.

---

# 13. أنواع البحث عن العناصر

## getBy

يجب أن يجد العنصر.

إذا لم يجده، يفشل الاختبار.

مثال:

```js
screen.getByRole('button', {
  name: /add to cart/i,
})
```

استخدم getBy عندما تتوقع أن العنصر موجود.

---

## queryBy

يرجع null إذا لم يجد العنصر.

مثال:

```js
expect(
  screen.queryByText('Cart is empty'),
).not.toBeInTheDocument()
```

استخدم queryBy عندما تريد التأكد أن عنصرًا غير موجود.

---

## findBy

يرجع Promise وينتظر العنصر حتى يظهر.

مثال:

```js
const product = await screen.findByText('Keyboard')
```

مفيد عندما تكون البيانات تصل بعد API أو عندما يكون الـ rendering غير متزامن.

---

# 14. ترتيب الأفضلية في البحث

يفضل البحث عن العناصر بهذا الترتيب:

```text
getByRole
    ↓
getByLabelText
    ↓
getByPlaceholderText
    ↓
getByText
    ↓
getByTestId
```

ابدأ دائمًا باستخدام semantic queries مثل:

```js
getByRole
```

واستخدم:

```js
getByTestId
```

عندما لا يوجد اختيار semantic مناسب.

---

# 15. user-event و fireEvent

الأسلوب المفضل حاليًا للتفاعل مع المستخدم هو:

```text
user-event
```

مثال:

```jsx
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'

test('adds product after clicking button', async () => {
  const user = userEvent.setup()

  render(<ProductCard />)

  await user.click(
    screen.getByRole('button', {
      name: /add to cart/i,
    }),
  )

  expect(
    screen.getByText('Added'),
  ).toBeInTheDocument()
})
```

## لماذا user-event؟

لأنه أقرب لسلوك المستخدم الحقيقي.

مثلًا التفاعل مع input قد يتضمن:

* Focus.
* Keyboard events.
* Input events.
* تغيير القيمة.

أما:

```js
fireEvent.click(button)
```

فهو يرسل event بشكل مباشر.

fireEvent مفيد في بعض الحالات، لكن user-event هو الاختيار الأساسي لتفاعل المستخدم.

---

# 16. الفرق بين Jest و React Testing Library

## Jest

نستخدم Jest لاختبار الـ logic والـ functions والـ mocks.

مثال:

```js
function calculateTotal(items) {
  return items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )
}

test('calculates cart total', () => {
  const items = [
    { price: 100, quantity: 2 },
    { price: 50, quantity: 1 },
  ]

  expect(calculateTotal(items)).toBe(250)
})
```

هذا الاختبار لا يحتاج React أو DOM.

---

## React Testing Library

نستخدم React Testing Library لاختبار سلوك الـ component وما يراه المستخدم.

مثال:

```jsx
test('shows cart total', () => {
  render(<Cart />)

  expect(
    screen.getByText('250'),
  ).toBeInTheDocument()
})
```

هنا لا نسأل الـ component عن متغير داخلي.

نحن نسأل:

```text
What does the user see?
```

---

# 17. عدم اختبار تفاصيل التنفيذ الداخلية

لا نريد اختبار الـ implementation details.

مثلًا:

```js
expect(component.state.cart.length).toBe(1)
```

هذا يختبر طريقة تنفيذ الـ component من الداخل.

الأفضل أن نختبر النتيجة الظاهرة للمستخدم:

```js
expect(
  screen.getByText('Keyboard'),
).toBeInTheDocument()

expect(
  screen.getByText('Quantity: 1'),
).toBeInTheDocument()
```

الفكرة الأساسية:

```text
Test the result
not
the internal implementation
```

---

# 18. اختبار Zustand

لدينا طريقتان أساسيتان.

## الطريقة الأولى: اختبار الـ Actions مباشرة

```js
import { act } from '@testing-library/react'
import { useCartStore } from './cartStore'

test('adds product to cart', () => {
  const product = {
    id: 1,
    title: 'Keyboard',
    price: 100,
    stock: 5,
  }

  act(() => {
    useCartStore.getState().addToCart(product)
  })

  const cart = useCartStore.getState().cart

  expect(cart).toHaveLength(1)

  expect(cart[0]).toMatchObject({
    id: 1,
    quantity: 1,
  })
})
```

هذا الاختبار يختبر Zustand Store والـ actions مباشرة، بدون استخدام component.

---

## الطريقة الثانية: اختبار المستخدم من خلال الـ Component

```jsx
test('user can add product to cart', async () => {
  const user = userEvent.setup()

  render(<ProductList />)

  await user.click(
    screen.getByRole('button', {
      name: /add keyboard to cart/i,
    }),
  )

  expect(
    screen.getByText('Keyboard'),
  ).toBeInTheDocument()

  expect(
    screen.getByText('Quantity: 1'),
  ).toBeInTheDocument()
})
```

هذا يختبر الرحلة الكاملة:

```text
User clicks
    ↓
Component calls Zustand action
    ↓
Zustand updates state
    ↓
React re-renders
    ↓
User sees updated UI
```

---

# 19. شكل المشروع

```text
src/
  api/
    axiosInstance.js
    productsApi.js

  store/
    shopStore.js

  components/
    ProductList.jsx
    ProductCard.jsx
    Cart.jsx
    CartItem.jsx

  tests/
    shopStore.test.js
    ProductCard.test.jsx
    ProductList.test.jsx
    Cart.test.jsx
```

---

# 20. متطلبات المشروع

المشروع سيحتوي على:

* JSON Server على port `3001`.
* React على port `5173`.
* Axios instance.
* ثلاثة منتجات.
* كل منتج لديه stock يساوي `5`.
* تحميل المنتجات من JSON Server.
* إضافة المنتجات إلى الكارت.
* حذف المنتجات من الكارت.
* زيادة الكمية.
* منع تجاوز الـ stock.
* منع إضافة منتج انتهى مخزونه.
* تفريغ الكارت.
* اختبار الـ store.
* اختبار الـ UI.
* اختبار الـ components.
* عمل mock للـ Axios.

---

# 21. Vite و Jest

Jest و Vite يستخدمان أنظمة مختلفة للتعامل مع الـ modules والـ transformations.

لذلك يحتاج استخدام Jest مع Vite إلى إعداد إضافي.

لدينا خياران.

## الاختيار التعليمي

نستخدم:

```text
Jest
```

مع إعداد الـ transform المناسب.

الميزة هي أننا نتعلم Jest نفسه كما هو مطلوب.

## الاختيار العملي مع Vite

يمكن استخدام:

```text
Vitest
```

لأنه مصمم للعمل بشكل طبيعي مع Vite، كما أن الـ API الخاص به قريب جدًا من Jest.

لكن هدفنا في هذا المشروع هو تعلم:

```text
Jest
```

لذلك سنستخدم Jest وسنشرح إعداداته أثناء بناء المشروع.

---

# 22. خطة المذاكرة

## أول 30 دقيقة

* فهم الـ state.
* فهم Zustand Store.
* فهم set.
* فهم get.
* فهم selectors.
* فهم الـ sync actions.
* فهم الـ async actions.

## من 30 إلى 60 دقيقة

* فهم Jest.
* فهم test structure.
* فهم matchers.
* فهم mocks.
* فهم async tests.
* فهم Axios mocking.

## من 60 إلى 90 دقيقة

* فهم render.
* فهم screen.
* فهم getByRole.
* فهم queryBy.
* فهم findBy.
* فهم user-event.

## آخر ساعة

نبني المشروع عمليًا:

1. إنشاء المشروع.
2. تثبيت الـ packages.
3. إعداد JSON Server.
4. إنشاء Axios instance.
5. إنشاء Zustand store.
6. بناء مكونات المنتجات.
7. بناء مكونات الكارت.
8. كتابة tests للـ store.
9. كتابة tests للـ components.
10. تشغيل الاختبارات وفهم كل failure.

---

# 23. أهم المفاهيم

Zustand

```text
State Management
```

Jest

```text
Test Runner
Assertions
Mocks
```

React Testing Library

```text
React + DOM Testing
```

user-event

```text
User Interaction
```

Axios

```text
HTTP Client
```

JSON Server

```text
Mock REST API
```

---

# 24. الخلاصة

Jest

```text
Test Runner
+
Assertions
+
Mocks
```

React Testing Library

```text
React Testing
+
DOM Testing
+
User Interaction
```

Zustand

```text
State Management
+
Actions
```

Axios

```text
HTTP Client
```

JSON Server

```text
Mock REST API
```

---

# 25. المراجع الرسمية

* Zustand Official Repository
  https://github.com/pmndrs/zustand

* Jest Getting Started
  https://jestjs.io/docs/getting-started

* Jest Expect
  https://jestjs.io/docs/expect

* Jest Mock Functions
  https://jestjs.io/docs/mock-functions

* React Testing Library
  https://testing-library.com/docs/react-testing-library/intro/

* Testing Library Queries
  https://testing-library.com/docs/queries/about/

* Testing Library User Event
  https://testing-library.com/docs/user-event/intro/

* Axios Official Repository
  https://github.com/axios/axios

---

# الخطوة التالية

بعد مراجعة المفاهيم، نبدأ المشروع عمليًا بالترتيب التالي:

```text
Project Setup
    ↓
JSON Server
    ↓
Axios
    ↓
Zustand
    ↓
React Components
    ↓
Jest Tests
    ↓
React Testing Library Tests
```
