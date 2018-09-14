# markwf.github.io

Personal website of Mark W. Firth

Requirements:
- Ruby https://rubyinstaller.org/downloads/ (pick bold version with devkit)
- gem install bundle
- bundle install
- Change Nokogiri in Gemfile.lock to 1.8.2
- bundle exec jekyll serve

- gem install jekyll
- gem 'jekyll-sitemap'
- gem 'jekyll-paginate'
- gem 'jemoji'

Docs:
- https://jekyllrb.com/
- https://github.com/qwtel/hydejack/issues/8
- https://stackoverflow.com/questions/10012181/bundle-install-returns-could-not-locate-gemfile


http://127.0.0.1:4000/

Access token:
https://www.instagram.com/oauth/authorize/?client_id=2f205830e2cd461aa9bd742c891589e0&redirect_uri=http://localhost&response_type=token&scope=public_content

Mobile:
- d-block d-md-none to hide on medium, large and extra large devices.
- d-none d-md-block to hide on small and extra-small devices.

https://css-tricks.com/snippets/jquery/smooth-scrolling/

# Mobile Web Notes


<meta name="viewport" content="width=device-width,initial-scale=1">

img, embed,
object, video {
  max-width:100%;
}

# tap target

nav a, button {
  min-width: 48px;
  min-height: 48px;
}

room between = 40px

# Media Queries

@media screen and (min-width: 500px) {
  .yes {
    opacity: 1;
  }
  .no {
    opacity: 0;
  }
}
