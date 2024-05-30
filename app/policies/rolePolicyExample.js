const atLeastEditor = async (req, res, next) => {
  const { user: authUser } = req.auth;

  if (!["Admin", "Editor"].includes(authUser?.role.Name)) {
    return res.apiForbidden("You cannot update this resource!");
  }

  next();
};

module.exports = { atLeastEditor };
