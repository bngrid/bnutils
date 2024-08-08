# bnutils

一个优雅的 javascript 工具库？（好吧，这是我的理想，事实上他才刚刚诞生。）

代码和文档中若有不严谨的地方，请通过邮箱<bngrid@outlook.com>联系我批评指正，谢谢。

## 安装

```bush
npm i bnutils
```

## bnupload

尝试给没有做过文件上传的前端程序员们一些小小的帮助。（没错，仅适用于前端）

这个工具函数的主要优势是仅需要通过 input[file] 的 id （或者直接传入文件）和后端程序员给出的服务器地址以及该文件对应的 key 即可完成文件上传。

他的缺点是只能进行单文件上传，不过这也衬托出他的优势：可以通过传入回调函数获取单个文件的 `上传进度` 并且随时 `取消上传` ，不会因为一个文件上传出了问题而所有文件全部停止传输。

这是一个例子：

```js
import { bnupload } from 'bnutils'

let cancelUpload // 取消上传的函数
function upload() {
  cancelUpload = bnupload({
    url: 'https://example.com/upload', // 服务器地址(可缩写)(必传)
    name: 'file-name', // 文件对应的key(必传)
    file: input.files[0], // 一个File类型的变量(传入file后就不需要传id了)
    id: 'file-input', // input[file]的id(和file属性互斥，优先判定file)
    method: 'POST', // HTTP 请求方法(默认为POST)
    query: {
      // 向URL结尾添加数据
      a: 123,
      b: 456
    },
    header: {
      // 向Headers中添加数据
      token: 'Bearer 123456'
    },
    body: {
      // 其他额外的formdata
      account: 'admin',
      password: '123456'
    },
    timeout: 60000, // 超时时间，单位为毫秒(默认为60000)
    progress: percent => {
      // 上传数据时周期性触发，返回0 ~ 100的进度
      console.log('上传进度：', percent)
    },
    success: data => {
      // 请求成功时触发，返回JSON数据
      console.log(data)
    },
    fail: type => {
      // 请求失败时触发，返回失败类型
      switch (type) {
        case 'error':
          console.log('请求出错')
          break
        case 'timeout':
          console.log('请求超时')
          break
        case 'abort':
          console.log('请求中断')
          break
        default:
          break
      }
    },
    complete: () => {
      // 请求结束时触发（调用成功、失败都会执行）
      console.log('请求完成')
    }
  })
}
```

## bndebounce / bnthrottle

防抖和节流主要用于处理高频触发的事件，比如滚动（scroll）、窗口大小调整（resize）、键盘输入（keyup/keydown）、鼠标移动（mousemove）等。这些技术通过减少事件处理函数的执行频率，来提高应用的性能和响应能力。

- 防抖：事件被触发 n 秒后再执行回调，如果在这 n 秒内又被触发，则重新计时。这意味着如果事件频繁触发，函数将不会执行，只有事件停止触发一段时间后才执行。（事后处理）

- 节流：保证在一定时间内只执行一次函数。如果在这段时间内再次触发事件，则不会执行，直到过了这段时间才重新具备执行能力。这意味着，无论事件触发多频繁，函数都将以固定的频率执行。（保证频率）

这两个函数对于我来说非常的实用，所以我将他们封装进了我的工具库，希望它能给你们带来帮助。

这是一个例子：

```js
import { bndebounce: debounce } from 'bnutils'

onrisize = () => {
  debounce(() => {
    // 传入一个函数
    console.log('当前宽度', innerWidth)
    console.log('当前高度', innerHeight)
  }, 500) // 时间，单位是毫秒，默认为600
} // bnthrottle和bndebounce的用法基本一致
```

## bnsse

很多前端程序员在请求 SSE 接口时，经常会使用 EventSource，但是这种方法不支持前端向后端传数据（例如使用 POST 并将数据放在 body 里），为此我对原生的 fetch 进行了一些封装，使他可以接收后端使用 SSE 传过来的文本字节流。

本次封装方式和 bnupload 差不多，但是有小部分不同，务必认真查看。

这是一个例子：

```js
import { bnsse } from 'bnutils'

let cancel // 中止请求的函数
function request() {
  cancel = bnsse({
    url: 'https://example.com/sse', // 服务器地址(可缩写)(必传)
    method: 'POST', // HTTP 请求方法(默认为GET)
    query: {
      // 向URL结尾添加数据
      a: 123,
      b: 456
    },
    header: {
      // 向Headers中添加数据
      token: 'Bearer 123456'
    },
    body: {
      // 添加body
      account: 'admin',
      password: '123456'
    },
    message: msg => {
      // 收到消息时触发，返回该消息解码后的字符串
      console.log('收到消息：', msg)
    },
    open: () => {
      // 第一次请求数据成功时触发
      console.log('成功连接')
    },
    error: err => {
      // 发生错误时触发，返回错误
      console.log(err)
    },
    close: () => {
      // 所有消息返回结束时触发
      console.log('请求完成')
    }
  })
}
```

## bnchunk

在某些情况下，后端程序员没有对大量数据进行分页时，前端程序员可能需要将超过十万条数据展示在页面上。

我们知道，在浏览器环境中，js 的执行和 DOM 渲染确实共享同一个线程。当需要在页面中一次性渲染大量数据时，‌ 如果一次性创建和添加大量的 DOM 节点，‌ 可能会导致浏览器性能下降，‌ 甚至出现卡顿或假死现象。‌ 通过使用分时函数，‌ 可以避免这种情况的发生，‌ 提高用户体验和应用程序的性能。‌

为了方便前端程序员更好地处理大量数据，这边封装了一下浏览器端的分时函数。

这是一个例子：

```js
import { bnchunk } from 'bnutils'

const elements = new Array(1_000_000).fill(0).map((_, i) => i) // 创建长度为一百万的数组，里面的元素从0开始依次递增
function append(element, index) {
  // 需要添加的元素和该元素的序号（从0开始）
  const div = document.createElement('div')
  div.textContent = `第${index}个元素：${element}`
  document.body.appendChild(div)
}
bnchunk(elements, append) // 第一个参数是数组或者一个数字，第二个参数是回调函数，参数有当前元素和序号
```

## bnanimation

有很多前端程序员写 js 动画的时候居然还在用 setInterval。

先说一下它的缺点：

- 执行时间不确定：动画的实际运行频率可能会受到其他 JavaScript 脚本、‌ 浏览器事件循环机制等因素的影响。
- 过度渲染和卡顿：如果动画的帧率远高于屏幕的刷新率，‌ 会导致页面的过度渲染和卡顿。‌
- CPU 资源浪费：当页面被隐藏或最小化时，‌setInterval 仍然会在后台继续执行。
- 无视网络延迟和代码错误：setInterval 会无视网络延迟，‌ 如果网络请求花费的时间比预期的要长，‌ 可能会导致动画不同步。‌

所以这边我使用 requestAnimationFrame 封装了一个非常简单的动画函数，它只能将一个数字从一个值在规定的时间内变成另一个值（事实上这就是动画的本质，但是我这边只写了平滑过渡）。

这是一个例子：

```js
import { bnanimation } from 'bnutils'

button.onclick = () => {
  bnanimation(1000, 0, 666, value => {
    // 这里传入四个参数，第一个是动画时常，第二个是起始值，第三个是最终值，第四个是回调函数，返回当前的值
    document.getElementById('content').textContent = `${value}`
  })
}
```

## bnrandom

在网上看到了一些有意思的函数，利用了 Math.random 函数实现，第一个是生成随机 16 进制颜色，另一个是生成随机字符串（26 个英文字母加数字）

这是一个例子：

```js
import { bnrandom } from 'bnutils'

bnrandom('color') // => '#00e696' (我的幸运色 :-) )
bnrandom('code', 10) // => 'd9gnwhgk2b' (一个10位长度的字符串，可以用作验证码)
```

## bnaudioarray

现在的浏览器已经越来越高级了，它基本上可以处理当前市面上绝大多数的音频。

这里封装了一个音频可视化的函数，我们可以传入 audio 节点的 id 和一个回调函数用来实时获取音频的频率数组。

这是一个例子：

```js
import { bnaudioarray } from 'bnutils'

bnaudioarray(
  'audioid', // audio节点的id
  array => {
    console.log(array) // 可以用该数组进行绘图
  },
  512 // 分析结果的细腻程度，必须是2的次方，默认值为2048
)
```

## bnvoice

我是没有想到浏览器竟然有这么高级的 API，可以直接将文字转语音并且播放出来。

我将这个 API 简单封装了一下，只需要传入文本，即可朗读，方便前端程序员处理朗读器的需求。

这是一个例子：

```js
import { bnvoice } from 'bnutils'

bnvoice({
  content: '这是一段文本', // 需要朗读的文本(必传)
  rate: 1, // 朗读速率，默认为1
  pitch: 1, // 朗读音调，默认为1
  end: () => {
    console.log('播放完成') // 结束后调用该函数
  },
  error: () => {
    console.log('发生错误') // 发生错误时调用该函数
  }
})
```
