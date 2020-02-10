SRCS := $(wildcard *.wat)
BINS := $(SRCS:%.wat=%.wasm)

all: $(BINS)

%.wasm: %.wat
	wat2wasm $^ -o $@
