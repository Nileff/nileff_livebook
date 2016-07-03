<?php
class MenuItem
{
    public $text;
    public $name;
    public $submenu;

    function __construct($text,$name){
        $this->text = addcslashes ($text, "\r\n\t");
        $this->name=addcslashes ($name, "\r\n\t");
    }

    function getJSON(){
        $submenuJSON = '';
        if($this->submenu)
        {
            $submenuJSON = ',"submenu":[';
            foreach ($this->submenu as &$value) {
                if($submenuJSON == ',"submenu":[') {
                    $submenuJSON .= $value->getJSON();
                }
                else{
                    $submenuJSON .= ','.$value->getJSON();
                }
            }
            $submenuJSON .= ']';
        }

        return '{"text":"'.$this->text.'","name":"'.$this->name.'"'.$submenuJSON.'}';
    }
}