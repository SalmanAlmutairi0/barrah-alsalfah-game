import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { HelpCircle, X, Target, Users, Vote, Clock } from "lucide-react";

export default function ScoringExplanation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-4 w-12 h-12 sm:bottom-6 sm:right-6 sm:w-16 sm:h-16 rounded-full shadow-lg z-50 p-0 flex items-center justify-center"
        variant="default"
      >
        <HelpCircle className="!w-6 !h-6 sm:!w-8 sm:!h-8" />
      </Button>

      {/* Overlay and Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <Card className="relative w-[90%] max-w-lg max-h-[80vh] overflow-y-auto m-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg md:text-xl text-right">
                  📊 نظام النقاط
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 text-right">
              {/* Imposter Scoring */}
              <div className="space-y-2 sm:space-y-3">
                <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                  <Target className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                  توزيع النقاط للشخص الي برا السالفة
                </h3>

                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                  <div className="flex flex-row-reverse justify-between items-center p-2 sm:p-3 bg-green-50 rounded text-xs sm:text-sm">
                    <span className="text-right flex-1">محد صوت عليه</span>
                    <span className="font-medium text-green-700 whitespace-nowrap ml-2">
                      +200 نقطة
                    </span>
                  </div>

                  <div className="flex flex-row-reverse justify-between items-center p-2 sm:p-3 bg-blue-50 rounded text-xs sm:text-sm">
                    <span className="text-right flex-1">
                      صوتو عليك بس خمنت الكلمة صح
                    </span>
                    <span className="font-medium text-blue-700 whitespace-nowrap ml-2">
                      +100 نقطة
                    </span>
                  </div>

                  <div className="flex flex-row-reverse justify-between items-center p-2 sm:p-3 bg-red-50 rounded text-xs sm:text-sm">
                    <span className="text-right flex-1">
                      صوتو عليك بس خمنت الكلمة غلط
                    </span>
                    <span className="font-medium text-red-700 whitespace-nowrap ml-2">
                      -50 نقطة
                    </span>
                  </div>

                  <div className="flex flex-row-reverse justify-between items-center p-2 sm:p-3 bg-gray-50 rounded text-xs sm:text-sm">
                    <span className="text-right flex-1">ماصوت على احد</span>
                    <span className="font-medium text-gray-700 whitespace-nowrap ml-2">
                      -25 نقطة
                    </span>
                  </div>
                </div>
              </div>

              {/* Innocent Scoring */}
              <div className="space-y-2 sm:space-y-3">
                <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                  توزيع النقاط للشخص الي داخل السالفة
                </h3>

                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                  <div className="flex flex-row-reverse justify-between items-center p-2 sm:p-3 bg-green-50 rounded text-xs sm:text-sm">
                    <span className="text-right flex-1">
                      صوت على الي برا السالفة و انقفط
                    </span>
                    <span className="font-medium text-green-700 whitespace-nowrap ml-2">
                      +150 نقطة
                    </span>
                  </div>

                  <div className="flex flex-row-reverse justify-between items-center p-2 sm:p-3 bg-blue-50 rounded text-xs sm:text-sm">
                    <span className="text-right flex-1">
                      صوت على الي برا السالفة و مانقفط
                    </span>
                    <span className="font-medium text-blue-700 whitespace-nowrap ml-2">
                      +75 نقطة
                    </span>
                  </div>

                  <div className="flex flex-row-reverse justify-between items-center p-2 sm:p-3 bg-gray-50 rounded text-xs sm:text-sm">
                    <span className="text-right flex-1">
                      صوت على واحد داخل السالفة
                    </span>
                    <span className="font-medium text-gray-700 whitespace-nowrap ml-2">
                      0 نقاط
                    </span>
                  </div>

                  <div className="flex flex-row-reverse justify-between items-center p-2 sm:p-3 bg-red-50 rounded text-xs sm:text-sm">
                    <span className="text-right flex-1">ماصوت على احد</span>
                    <span className="font-medium text-red-700 whitespace-nowrap ml-2">
                      -25 نقطة
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Rules */}
              <div className="space-y-2 sm:space-y-3">
                <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                  <Vote className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                  قواعد إضافية
                </h3>

                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <span>•</span>
                    <span>
                      في حالة التعادل في التصويت، ينجو الي برا السالفة
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span>•</span>
                    <span>الي برا السالفة عنده فرصة يخمن الكلمة اذا انقفط</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span>•</span>
                    <span>اذا ماصوت يخصم عليك 25 نقطة</span>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-amber-50 p-2 sm:p-3 rounded-lg border border-amber-200">
                <h4 className="font-medium text-amber-800 mb-1 sm:mb-2 flex items-center gap-1 text-xs sm:text-sm">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  نصائح للفوز
                </h4>
                <ul className="text-xs sm:text-sm text-amber-700 space-y-0.5 sm:space-y-1">
                  <li>• دايم صوت على اي احد</li>
                  <li>• ركز على التناقض في اجابات الي يجاوبون</li>
                  <li>
                    • اذا كنت الي برا السالفة، حاول تجاوب بشكل عام على التصنيف
                    المختار
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
