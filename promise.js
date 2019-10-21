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
  var self = this;
  if (self.status === "Fulfilled") {

    // 执行成功的回调
    onFulfilled(self.resolveValue);
  }
  if (self.status === "Rejected") {
    // 执行失败的回调
    onRejected(self.rejectReason);
  }
  // 执行异步操作的时候不会改变状态，所以状态还是pending
  if (self.status === "pending") {
    // 把失败和成功的回调放到对应的数组中
    self.ResolveCallBackList.push(function() {
      onFulfilled(self.resolveValue);
    });
    self.RejectCallBackList.push(function() {
      onRejected(self.rejectReason);
    });
  }
};
