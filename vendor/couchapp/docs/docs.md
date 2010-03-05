# Docs for the docs system.

You are encouraged to use the couchapp docs system to write documentation for your plugins and applications. Extra bonus points because it's fun.

Docs automatically make divs based on `$("#foo")` pattern matching. That is, we regex the code looking for the first id we see referenced. Remember ids need to be unique on a page. For doc examples you only get one id.

Example Code:

    $("#hide_foo").hide("slow");

That's all it takes. You only get one div in each example for now. Have fun!