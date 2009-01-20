require 'rubygems'
require 'couchrest'

db = CouchRest.database! 'http://jchris:animal@127.0.0.1:5984/couchblog'

# you'll need to replace Post and Comment with whatever classes hold your data.

idmap = {};

# import all the posts
posts = Post.find :all

# to work with couchdb-example-blog, you need to keep the shape of the resulting 
# documents the same, although you are free to add new fields or omit others.

posts.each do |p|
  puts p.title
  post = {
    'type' => 'post',
    '_id' => p.permalink,
    :title => p.title,
    :body => p.body,
    :format => 'textile',
    :html => p.description,
    :slug => p.permalink,
    :legacy_id => p.id,
    :author => p.user.login,
    :updated_at => p.updated_at,
    :created_at => p.created_at
  }
  if p.section
    post[:tags] = [p.section.path]
  end
  couch_id = db.save(post)["id"]
  idmap[p.id] = couch_id
end

puts idmap.inspect

# import all the comments
comments = Comment.find :all
comments.each do |c|
  puts c.name
  post_couch_id = idmap[c.post_id]
  unless c.email
    puts "enter email for #{c.inspect}"
    c.email = gets.chomp
  end
  comment = {
    'type' => 'comment',
    :commenter => {
      :name => c.name,
      :email => c.email,
      :url => c.link
    },
    :body => c.body,
    :format => 'textile',
    :html => c.description,
    :post_id => post_couch_id,
    :updated_at => c.updated_at,
    :created_at => c.created_at
  }
  db.save(comment) rescue puts "no save"
end