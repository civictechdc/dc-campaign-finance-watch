exports.getNextElection = function(req, res) {
  var nextElection = new Date(2015, 3, 28);
  res.json({ nextElection: nextElection });
}
