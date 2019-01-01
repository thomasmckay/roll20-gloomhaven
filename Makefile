BUILD_DIR=build

GLOOMHAVEN_FILES = \
	gloomhaven.js \
	gloomhaven_cards.js \
	gloomhaven_deck_builder.js \
	gloomhaven_monster_card.js \
	gloomhaven_monster_stats.js \
	gloomhaven_set_level.js

#BUILD_FILES := $(addprefix $(BUILD_DIR)/, $(GLOOMHAVEN_FILES))

all: build

build: $(BUILD_DIR)/build.js upload

$(BUILD_DIR)/build.js: $(GLOOMHAVEN_FILES)
	mkdir -p $(@D)
	$(RM) $@
	cat $^ >> $@

GAME=3922546
SCRIPT=313710
upload:
	cd build && \
	rm -f roll20*.cookies && \
	curl \
		--verbose \
		-c roll20.cookies \
		-H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' \
		-H 'Accept-Encoding: br, gzip, deflate' \
		-H 'Host: app.roll20.net' \
		-H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Safari/605.1.15' \
		-H 'Accept-Language: en-us' \
		-d @login.txt \
		-o roll20_login.response https://app.roll20.net/sessions/create \
	--next \
		--verbose \
		-H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' \
		-H 'Host: app.roll20.net' \
		-H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Safari/605.1.15' \
		-H 'Accept-Language: en-us' \
		-H 'Referer: https://app.roll20.net/sessions/create' \
		https://app.roll20.net/campaigns/save_script/$(GAME)/$(SCRIPT) \
		--data-urlencode 'name=build.js' \
		--data-urlencode content@build.js \
		2> /dev/null

