/**
 * Game field
 * @class
 * @extends Group
 */
var Field = Class.create(Group, {
	initialize: function() {
		Group.call(this);
		this.x = 400;
		this.y = 100;
	}
});
