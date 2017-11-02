


function render_error(ctx, reason, errors = {}, status = 400) {
  ctx.status = status;
  ctx.body = { reason, errors };
}


export default {
  render_error,
}
