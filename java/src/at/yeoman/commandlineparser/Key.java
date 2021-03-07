package at.yeoman.commandlineparser;

import java.util.function.Function;

public final class Key<T> {
    final CommandLineParser parser;
    final Class<T> type;
    final boolean hasArgument;
    final T defaultValue;
    final boolean isOptional;
    final Function<String, T> convert;
    
    public Key(CommandLineParser parser, Class<T> type, boolean hasArgument, T defaultValue, boolean isOptional, Function<String, T> convert) {
        this.parser = parser;
        this.type = type;
        this.hasArgument = hasArgument;
        this.defaultValue = defaultValue;
        this.isOptional = isOptional;
        this.convert = convert;
    }
}
