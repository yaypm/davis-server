# How to contribute

## Davis Core vs Plugins

Functionality and features are typically implemented by adding a plugin rather
than modifying the Davis core. Core changes are typically reserved for features
that are taken advantage of by plugins rather than by the end user. If you are
not sure where your change should be added, try to implement it as a plugin. If
you have difficulties or find that you cannot implement your feature without
some additional processing or information from the core, then maybe a core
change should be made.

Plugins are stored in `lib/plugins` with camelCase names.  Plugins should
export a single class with the same name but with the first leter capitalized.
For example the file `lib/plugins/myFeature.js` should export the class
`MyFeature`. Plugins are typically stored as folders, with their main entry
points in their `index.js` file. For more information on how to create plugins,
please see the wiki.

Files in Davis core are stored in `lib/classes`. If you are adding a new class,
you may need to add its reference to the Davis object in `lib/Davis.js`.
Classes that are meant to be instantiated and used by the caller are typically
stored in the `davis.classes` array, and classes that are meant to be
instantiated once at start are typically stored directly on the `davis` object
or on another class. For instance, the `Nlp` class is stored on the
`PluginManager` class because it is not used anywhere else.

## Testing

All unit tests are stored in the `tests` directory. If you are implementing a
new feature or fixing a bug, please add a test that breaks without your change,
but does not break with your change. This will help us to understand what your
code is trying to accomplish, and will also help us not to break your feature
or reintroduce your bug in the future. All pull requests are automatically
tested before they are merged so make sure your tests pass.

