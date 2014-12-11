# Original code taken from: http://charliepark.org/tags-in-jekyll
# Thanks Charlie!

module Jekyll
  class TagIndexPage < Page
    def initialize(site, base, dir, tag)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'
      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'tag-index.html')
      self.data['tag'] = tag
      self.data['title'] = tag
    end
  end

  class TagIndexGenerator < Generator
    safe true

    def generate(site)
      if site.layouts.key? 'tag-index'
        dir = 'tags'
        site.tags.keys.each do |tag|
          create_tag_index_page(site, File.join(dir, tag), tag)
        end
      end
    end

    def create_tag_index_page(site, dir, tag)
      index = TagIndexPage.new(site, site.source, dir, tag)
      index.render(site.layouts, site.site_payload)
      index.write(site.dest)
      site.pages << index
    end
  end
end