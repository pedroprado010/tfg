function is_command(command) {
  return typeof command === 'object' && !!command.action
}

module.exports = is_command;
