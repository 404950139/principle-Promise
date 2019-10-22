function MyPromise(executor) {
  var self = this;
  // 初始状态
  self.status = "pending";
  self.resolveValue = null;
  self.rejectReason = null;
  self.ResolveCallBackList = [];
  self.RejectCallBackList = [];
  function resolve(value) {
    // 只有当状态为pending时,才能执行
    if (self.status == "pending") {
      // 改变为成功状态
      self.status = "Fulfilled";
      //   添加返回值
      self.resolveValue = value;
      self.ResolveCallBackList.forEach(function(ele) {
        ele();
      });
    }
  }
  function reject(reason) {
    if (self.status == "pending") {
      // 改变为失败的状态
      self.status = "Rejected";
      //   添加返回值
      self.rejectReason = reason;
      self.RejectCallBackList.forEach(function(ele) {
        ele();
      });
    }
  }
  try {
    // 执行传入的函数
    executor(resolve, reject);
  } catch (e) {
    //   如果出现错误就执行reject
    reject(e);
  }
}

MyPromise.prototype.then = function(onFulfilled, onRejected) {
  // 如果没有onFulfilled,直接将当前then的值抛给下一个then
  if (!onFulfilled) {
    onFulfilled = function (val) {
      return val;
    }
  };
  // 如果没有onRejected，直接将当前then的错误通过throw抛给下一个then
  if (!onRejected) {
    onRejected = function (reason) {
      throw new Error(reason);
    }
  };
  var self = this;
  var nextPromise = new MyPromise(function(res, rej) {
    if (self.status === "Fulfilled") {
      // 模拟then的异步执行
      setTimeout(function() {
        // 通过try catch来捕获执行中的错误
        try {
          // 执行成功的回调
          var nextResolveValue = onFulfilled(self.resolveValue);
          res(nextResolveValue);
        } catch (e) {
          rej(e);
        }
      }, 0);
    }
    if (self.status === "Rejected") {
      // 模拟then的异步执行
      setTimeout(function() {
        // 通过try catch来捕获执行中的错误
        try {
          // 执行失败的回调
          var nextRejectReason = onRejected(self.rejectReason);
          res(nextRejectReason);
        } catch (e) {
          rej(e);
        }
      }, 0);
    }
    // 执行异步操作的时候不会改变状态，所以状态还是pending
    if (self.status === "pending") {
      // 把失败和成功的回调放到对应的数组中
      self.ResolveCallBackList.push(function() {
        // 模拟then的异步执行
        setTimeout(function() {
          // 通过try catch来捕获执行中的错误
          try {
            var nextResolveValue = onFulfilled(self.resolveValue);
            res(nextResolveValue);
          } catch (e) {
            rej(e);
          }
        }, 0);
      });
      self.RejectCallBackList.push(function() {
        // 模拟then的异步执行
        setTimeout(function() {
          // 通过try catch来捕获执行中的错误
          try {
            var nextRejectReason = onRejected(self.rejectReason);
            res(nextRejectReason);
          } catch (e) {
            rej(e);
          }
        }, 0);
      });
    }
  });
  return nextPromise;
};
