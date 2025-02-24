import Text "mo:base/Text";
import Char "mo:base/Char";
import Prim "mo:⛔";

module {
    public func normalizeText(hashtag: Text): Text {
        var result: Text = "";
        for(c in Text.toIter(hashtag)){
            let cUpper = Prim.charToUpper(c);
            result #= switch cUpper {
                case (' ') {""};
                case ('Á' or 'À') { "A" };
                case ('É' or 'È') { "E" };
                case ('Í' or 'Ì') { "I" };
                case ('Ó' or 'Ò') { "O" };
                case ('Ú' or 'Ù') { "U"};
                case n { Char.toText(n) };
            }
        };
        result   
    };
}