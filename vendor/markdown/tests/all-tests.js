var assert = require("test/assert");
var markdown = require("markdown");

exports.testH1 = function () {
    assert.eq("<h1>Hi</h1>", markdown.encode("Hi\n="));
};

exports.testP = function () {
    assert.eq("<p>Paragraph.</p>", markdown.markdown("Paragraph."));
};

if (require.main === module.id)
    require("os").exit(require("test/runner").run(exports));
