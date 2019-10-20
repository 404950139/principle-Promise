function MyPromise(executor) {
  var self = this;
  // 初始状态
  self.status = "pending";
  self.resolveValue = null;
  self.rejectReason = null;
  function resolve(value) {
    // 只有当状态为pending时,才能执行
    if (self.status == "pending") {
      // 改变为成功状态
      self.status = "Fulfilled";
      //   添加返回值
      self.resolveValue = value;
    }
  }
  function reject(reason) {
    if (self.status == "pending") {
      // 改变为失败的状态
      self.status = "Rejected";
      //   添加返回值
      self.rejectReason = reason;
    }
  }
  try {
    // 执行传入的函数
    executor(resolve, reject);
  } catch (e) {
    //   如果出现错误就执行reject
    reject(e);
  }
};

MyPromise.prototype.then = function(onFulfilled, onRejected) {
  var self = this;
  if (self.status === "Fulfilled") {
    onFulfilled(self.resolveValue);
  }
  if (self.status === "Rejected") {
    onRejected(self.rejectReason);
  }
};
