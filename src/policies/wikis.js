const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {
  new() {
    return this.user != null || this._isAdmin();
  }

  create() {
    return this.user != null || this._isAdmin();
  }

  edit() {
    return this.new() && (this._isOwner() || this._isAdmin()) && this.record;
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this.update();
  }
};
