module Jekyll
  class HumbleXamplesSourceTag < Liquid::Tag

    def initialize(tag_name, text, tokens)
      super
      @source = text
    end

    def render(context)
      "<p class='alert alert-info'>All the source code used in this post is available on GitHub. Download it <a href='https://github.com/ironcev/HumbleXamples/tree/master/#{@source}'>here</a>.</p>"
    end
  end
end

Liquid::Template.register_tag('hx_src', Jekyll::HumbleXamplesSourceTag)