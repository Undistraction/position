# Copy latest docs from master branch
git checkout master ./docs
git add -A
git c -m "Update Docs"
git push origin gh-pages
