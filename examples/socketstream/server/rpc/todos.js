// Server-side code

// All the tobuys are stored in an in-memory array on the server
// This should not be done in production apps
var tobuys = [];

// Define actions which can be called from the client using
// ss.rpc('demo.ACTIONNAME', param1, param2...)
exports.actions = function (req, res, ss) {
	return {
		getAll: function () {
			res(tobuys);
		},
		update: function (clientTodos) {
			tobuys = clientTodos;
			ss.publish.all('updateTodos', tobuys);
		}
	};
};
