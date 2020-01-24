.PHONY: clean

org-capture-extension.zip: *
	zip -r $@ . -x '$@' '.git/*'

clean:
	rm -f org-capture-extension.zip
