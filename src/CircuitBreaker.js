class CircuitBreaker {
  constructor(request, options = {}) {
    const defaults = {
      failureThreshold: 3,
      successThreshold: 2,
      timeout: 6000,
      url: 'http://localhost:3000/healthcheck'
    }

    Object.assign(this, defaults, options, {
      request,
      state: "CLOSED",
      failureCount: 0,
      successCount: 0,
      server: "Main",
      nextAttempt: Date.now()
    })
  }

  async fire() {
    if (this.state === "OPEN") {
      if (this.nextAttempt <= Date.now()) {
        this.state = "HALF"
      } else {
        throw new Error("Breaker is OPEN")
      }
    }
    try {
      const response = await this.request(this.url)
      this.server = "Main"
      return this.success(response)
    } catch (error) {
      return this.fail(error)
    }
  }

  success(response) {
    if (this.state === "HALF") {
      this.successCount++
      if (this.successCount > this.successThreshold) {
        this.server = "Main"
        this.close()
      }
    }

    this.failureCount = 0
    this.status("Success")
    return response
  }

  fail(err) {
    this.failureCount++
    if (this.failureCount >= this.failureThreshold) {
      this.server = "Backup"
      this.open()
    }
    this.status("Failure")
    if (this.fallback) return this.tryFallback()
    return err
  }

  open() {
    this.state = "OPEN"
    this.nextAttempt = Date.now() + this.timeout
  }

  close() {
    this.successCount = 0
    this.failureCount = 0
    this.state = "CLOSED"
  }

  half() {
    this.state = "HALF"
  }

  async tryFallback() {
    console.log("Attempting fallback request")
    try {
      const response = await this.fallback()
      this.server = "Backup"
      return response
    } catch (err) {
      return err
    }
  }

  status(action) {
    console.table({
      Action: action,
      Timestamp: new Date().toDateString(),
      Successes: this.successCount,
      Failures: this.failureCount,
      Server: this.server,
      "Next State": this.state
    })
  }
}

module.exports = CircuitBreaker
