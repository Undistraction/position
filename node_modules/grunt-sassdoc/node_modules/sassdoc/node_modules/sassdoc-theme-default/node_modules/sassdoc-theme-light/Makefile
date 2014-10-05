SASS = sass
UGLIFY = node_modules/uglify-js/bin/uglifyjs

all: sass min

min: assets/js/main.min.js

assets/js/main.min.js: \
	assets/js/vendor/fuse.min.js \
	assets/js/sidebar.js \
	assets/js/search.js \
	assets/js/main.js \
	assets/js/vendor/prism.min.js
	cat $^ | $(UGLIFY) > $@

sass:
	$(SASS) --update scss:assets/css --style compressed

clean:
	$(RM) -r assets/js/main.min.js assets/css
