
package at.yeoman.commandlineparser;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

public class CommandLineParser {
    private HashMap<Key<?>, Object> values = new HashMap<>();
    private HashMap<String, Key<?>> keys = new HashMap<>();
    private List<String> freeArguments = new ArrayList<>();
    private boolean freeArgumentsEnabled = false;
    private boolean debug = false;
    private boolean parseWasCalled;
    
    public Key<Boolean> addOption(String name) {
        return addKey(name, Boolean.class, false, false, true, value -> true);
    }
    
    public Key<Boolean> addBoolean(String name) {
        return addKey(name, Boolean.class, true, null, false, Boolean::parseBoolean);
    }
    
    public Key<String> addString(String name) {
        return addKey(name, String.class, true, null, false, value -> value);
    }
    
    public Key<Integer> addInt(String name) {
        return addKey(name, Integer.class, true, null, false, Integer::parseInt);
    }
    
    public Key<Long> addLong(String name) {
        return addKey(name, Long.class, true, null, false, Long::parseLong);
    }
    
    public Key<Double> addDouble(String name) {
        return addKey(name, Double.class, true, null, false, Double::parseDouble);
    }
    
    public Key<Boolean> addOptionalBoolean(String name) {
        return addKey(name, Boolean.class, true, null, true, Boolean::parseBoolean);
    }
    
    public Key<String> addOptionalString(String name) {
        return addKey(name, String.class, true, null, true, value -> value);
    }
    
    public Key<Integer> addOptionalInt(String name) {
        return addKey(name, Integer.class, true, null, true, Integer::parseInt);
    }
    
    public Key<Long> addOptionalLong(String name) {
        return addKey(name, Long.class, true, null, true, Long::parseLong);
    }
    
    public Key<Double> addOptionalDouble(String name) {
        return addKey(name, Double.class, true, null, true, Double::parseDouble);
    }
    
    public void setFreeArgumentsEnabled(boolean value) {
        freeArgumentsEnabled = value;
    }
    
    private <T> Key<T> addKey(String name, Class<T> type, boolean hasArgument, T defaultValue, boolean isOptional, Function<String, T> convert) {
        Key<T> key = new Key<>(this, type, hasArgument, defaultValue, isOptional, convert);
        
        Key<?> previous = keys.putIfAbsent(name, key);
        
        if (previous != null) {
            throw new IllegalArgumentException("Key for name [" + name + "] already registered");
        }
        
        return key;
    }
    
    public void parse(String[] args) throws ParsingException {
        parse(Arrays.asList(args));
    }
    
    public void parse(List<String> args) throws ParsingException {
        if (parseWasCalled) {
            throw new IllegalStateException("Attempt to parse again");
        }
        
        parseWasCalled = true;
        
        final int size = args.size();
        
        for (int index = 0; index < size; ++index) {
            int pos = (index + 1);
            
            String keyName = args.get(index);
            
            if (!keyName.startsWith("-")) {
                if (freeArgumentsEnabled) {
                    freeArguments.add(keyName);
                    continue;
                } else {
                    throw new ParsingException("Expected key of form -<name> at position " + pos + ", found [" + keyName + "]");
                }
            }
            
            if (keyName.length() < 2) {
                throw new ParsingException("Expected name after [" + keyName + "] at position " + pos);
            }
            
            if (index + 1 >= size) {
                throw new ParsingException("Missing value after key [" + keyName + "] at position " + (index + 1));
            }
            
            Key<?> key = keys.get(keyName.substring(1));
            
            if (key == null) {
                throw new ParsingException("Unknown key [" + keyName + "] at position " + pos);
            }
            
            if (values.containsKey(key)) {
                throw new ParsingException("Recurring key [" + keyName + "] at position " + pos);
            }
            
            String value = null;
            
            if (key.hasArgument) {
                if (index + 1 >= size) {
                    throw new ParsingException("Missing value after key [" + keyName + "] at position " + pos);
                }
                
                ++index;
                value = args.get(index);
            }
            
            try {
                values.put(key, key.convert.apply(value));
            } catch (Exception exc) {
                if (debug) {
                    exc.printStackTrace();
                }
                
                throw new ParsingException("Not a value of type " + key.type.getSimpleName() + " at position " + (index + 2) + ": [" + value + "]");
            }
        }
        
        for (Map.Entry<String, Key<?>> entry : keys.entrySet()) {
            Key<?> key = entry.getValue();
            
            if (key.defaultValue == null && !key.isOptional && !values.containsKey(key)) {
                throw new ParsingException("Missing argument [" + entry.getKey() + "]");
            }
        }
    }
    
    @SuppressWarnings("unchecked")
    public <T> T get(Key<T> key) {
        if (!parseWasCalled) {
            throw new IllegalStateException("parse(...) has not yet been called.");
        }
        
        if (key.parser != this) {
            throw new IllegalArgumentException("Key was created by another parser instance");
        }
        
        T result = (T) values.get(key);
        
        if (result != null) {
            return result;
        } else if (key.isOptional || key.defaultValue != null) {
            return key.defaultValue;
        } else {
            throw new IllegalStateException("Result of type " + key.type.getSimpleName() + " and the default value are both null");
        }
    }
    
    public <T> boolean hasValue(Key<T> key) {
        return values.containsKey(key);
    }
    
    public boolean getDebug() {
        return debug;
    }
    
    public void setDebug(boolean value) {
        debug = value;
    }
}
